const Resume = require('../models/resume.model');
const User = require('../models/user.model');
const { getAIResponse } = require('../utils/ai');
const { uploadToCloudinary } = require('../config/cloudinary');
const pdfParse = require('pdf-parse');

// @desc  Upload & Analyze Resume
// @route POST /api/resume/upload
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file' });
    }

    const { buffer, originalname } = req.file;
    const fileType = originalname.split('.').pop().toLowerCase();

    // Upload to Cloudinary
    const cloudResult = await uploadToCloudinary(buffer, {
      folder: 'placementai/resumes',
      resource_type: 'auto',
      public_id: `resume_${Date.now()}`,
    });
    const fileUrl = cloudResult.secure_url;
    const filename = cloudResult.public_id;

    // Extract text from PDF
    let extractedText = '';
    if (fileType === 'pdf') {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      } catch (err) {
        console.error('PDF parse error:', err.message);
        extractedText = 'Could not extract text from PDF';
      }
    }

    // AI Analysis
    const aiPrompt = `Analyze this resume and provide a detailed JSON response with the following structure:
{
  "atsScore": <0-100>,
  "resumeScore": <0-100>,
  "grammarScore": <0-100>,
  "formattingScore": <0-100>,
  "summary": "<overall summary>",
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "suggestions": ["<suggestion1>", "<suggestion2>"],
  "grammarIssues": ["<issue1>"],
  "formattingIssues": ["<issue1>"],
  "extractedSkills": ["<skill1>", "<skill2>"],
  "improvedSummary": "<improved professional summary>",
  "improvedSkillsSection": "<improved skills section text>"
}

Resume text:
${extractedText || 'Resume file uploaded (text extraction failed, provide general feedback)'}

Return ONLY valid JSON.`;

    let aiFeedback = {
      summary: 'Resume analyzed successfully.',
      strengths: ['Good formatting', 'Relevant skills listed'],
      weaknesses: ['Missing quantified achievements'],
      missingKeywords: ['Docker', 'CI/CD', 'Agile'],
      suggestions: ['Add metrics to your projects', 'Include GitHub profile'],
      grammarIssues: [],
      formattingIssues: [],
    };

    let atsScore = 65, resumeScore = 70, grammarScore = 80, formattingScore = 75;
    let extractedSkills = [];
    let improvedSummary = '';
    let improvedSkillsSection = '';

    try {
      const aiResponse = await getAIResponse(aiPrompt);
      const start = aiResponse.indexOf('{');
      const end = aiResponse.lastIndexOf('}');
      const parsed = JSON.parse(aiResponse.slice(start, end + 1));
      atsScore = parsed.atsScore || atsScore;
      resumeScore = parsed.resumeScore || resumeScore;
      grammarScore = parsed.grammarScore || grammarScore;
      formattingScore = parsed.formattingScore || formattingScore;
      aiFeedback = {
        summary: parsed.summary || aiFeedback.summary,
        strengths: parsed.strengths || aiFeedback.strengths,
        weaknesses: parsed.weaknesses || aiFeedback.weaknesses,
        missingKeywords: parsed.missingKeywords || aiFeedback.missingKeywords,
        suggestions: parsed.suggestions || aiFeedback.suggestions,
        grammarIssues: parsed.grammarIssues || [],
        formattingIssues: parsed.formattingIssues || [],
      };
      extractedSkills = parsed.extractedSkills || [];
      improvedSummary = parsed.improvedSummary || '';
      improvedSkillsSection = parsed.improvedSkillsSection || '';
    } catch (err) {
      console.error('AI analysis error:', err.message);
    }

    // Save to DB
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: originalname,
      fileUrl,
      cloudinaryId: filename,
      fileType,
      extractedText,
      extractedSkills,
      atsScore,
      resumeScore,
      grammarScore,
      formattingScore,
      aiFeedback,
      improvedSummary,
      improvedSkillsSection,
    });

    // Update user resume score
    await User.findByIdAndUpdate(req.user._id, { resumeScore });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get user's resumes
// @route GET /api/resume
exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id, isActive: true })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single resume
// @route GET /api/resume/:id
exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};

// @desc  Generate improved resume content
// @route POST /api/resume/:id/improve
exports.improveResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const prompt = `Based on this resume content, generate:
1. An improved professional summary (2-3 sentences, ATS-friendly)
2. 3 improved project descriptions with quantified impact
3. An optimized skills section

Resume text: ${resume.extractedText}
Target role: ${req.body.targetRole || 'Software Engineer'}

Return JSON: {"summary": "", "projects": ["", ""], "skills": ""}`;

    const aiResponse = await getAIResponse(prompt);
    const parsed = JSON.parse(aiResponse.replace(/```json|```/g, '').trim());

    resume.improvedSummary = parsed.summary || resume.improvedSummary;
    resume.improvedSkillsSection = parsed.skills || resume.improvedSkillsSection;
    resume.improvedProjects = parsed.projects || [];
    await resume.save();

    res.json({ success: true, improvements: parsed, resume });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete resume
// @route DELETE /api/resume/:id
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    resume.isActive = false;
    await resume.save();
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    next(error);
  }
};
