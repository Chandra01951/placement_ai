const { getAIResponse, streamAIResponse } = require('../utils/ai');
const User = require('../models/user.model');

const extractJSON = (text) => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON found in AI response');
  return JSON.parse(text.slice(start, end + 1));
};

// @desc  AI Career Advisor
// @route POST /api/ai/career-advice
exports.getCareerAdvice = async (req, res, next) => {
  try {
    const { skills, interests, cgpa, preferredDomain } = req.body;

    const prompt = `As a career advisor for Indian engineering students, analyze the following profile and suggest career paths:

Skills: ${skills.join(', ')}
Interests: ${interests}
CGPA: ${cgpa}
Preferred Domain: ${preferredDomain}

Return JSON:
{
  "recommendedRoles": [
    {
      "title": "Role Title",
      "matchScore": 85,
      "description": "brief description",
      "avgSalary": "8-15 LPA",
      "requiredSkills": ["skill1", "skill2"],
      "missingSkills": ["skill3"],
      "certifications": ["cert1"],
      "roadmap": [
        {"week": 1, "topics": ["topic1", "topic2"]},
        {"week": 2, "topics": ["topic3"]}
      ]
    }
  ],
  "overallAdvice": "Personalized advice text"
}

Return only valid JSON.`;

    const aiResponse = await getAIResponse(prompt);
    const parsed = extractJSON(aiResponse);

    res.json({ success: true, advice: parsed });
  } catch (error) {
    next(error);
  }
};

// @desc  AI Chatbot
// @route POST /api/ai/chat
exports.chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    const systemContext = `You are PlacementAI, a helpful assistant for engineering students preparing for campus placements in India. 
You help with: resume tips, interview preparation, DSA problems, career guidance, company-specific preparation.
Be concise, practical, and encouraging. Use bullet points when helpful.`;

    const conversationHistory = history.map(h => `${h.role}: ${h.content}`).join('\n');
    const prompt = `${systemContext}

Previous conversation:
${conversationHistory}

Student: ${message}

PlacementAI:`;

    const aiResponse = await getAIResponse(prompt);
    res.json({ success: true, reply: aiResponse });
  } catch (error) {
    next(error);
  }
};

// @desc  AI Skill Gap Analysis
// @route POST /api/ai/skill-gap
exports.skillGapAnalysis = async (req, res, next) => {
  try {
    const { currentSkills, targetRole, experience } = req.body;

    const prompt = `Analyze skill gap for a student with these skills targeting ${targetRole} role:
Current Skills: ${currentSkills.join(', ')}
Experience Level: ${experience}

Return JSON:
{
  "missingCriticalSkills": ["skill1"],
  "missingNiceToHaveSkills": ["skill2"],
  "existingStrengths": ["strength1"],
  "learningPlan": [
    {"skill": "skill1", "priority": "high", "timeToLearn": "2 weeks", "resources": ["resource1"]}
  ],
  "estimatedReadinessTime": "3 months",
  "readinessPercentage": 60
}`;

    const aiResponse = await getAIResponse(prompt);
    const parsed = extractJSON(aiResponse);

    res.json({ success: true, analysis: parsed });
  } catch (error) {
    next(error);
  }
};

// @desc  AI Salary Predictor
// @route POST /api/ai/salary-predict
exports.predictSalary = async (req, res, next) => {
  try {
    const { skills, cgpa, college, branch, experience, targetRole, location } = req.body;

    const prompt = `Predict salary range for an engineering student in India:
Role: ${targetRole}
Skills: ${skills.join(', ')}
CGPA: ${cgpa}
College: ${college}
Branch: ${branch}
Location: ${location}
Experience: ${experience}

Return JSON:
{
  "predictedRange": {"min": 600000, "max": 1200000},
  "currency": "INR",
  "confidence": 75,
  "factors": ["factor1 (positive)", "factor2 (negative)"],
  "topPayingCompanies": [{"company": "Amazon", "range": "20-30 LPA"}],
  "tips": ["tip to increase salary"]
}`;

    const aiResponse = await getAIResponse(prompt);
    const parsed = extractJSON(aiResponse);

    res.json({ success: true, prediction: parsed });
  } catch (error) {
    next(error);
  }
};

// @desc  AI Cover Letter Generator
// @route POST /api/ai/cover-letter
exports.generateCoverLetter = async (req, res, next) => {
  try {
    const { jobTitle, company, skills, experience, resumeSummary } = req.body;

    const prompt = `Write a professional cover letter for:
Job: ${jobTitle} at ${company}
Candidate Skills: ${skills.join(', ')}
Experience: ${experience}
Resume Summary: ${resumeSummary}

Write a compelling, personalized cover letter (3 paragraphs). Be specific to the role and company. Return only the cover letter text.`;

    const coverLetter = await getAIResponse(prompt);
    res.json({ success: true, coverLetter });
  } catch (error) {
    next(error);
  }
};

// @desc  Daily DSA Challenge
// @route GET /api/ai/daily-challenge
exports.getDailyChallenge = async (req, res, next) => {
  try {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

    const topics = ['Arrays', 'Strings', 'LinkedList', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Binary Search'];
    const topic = topics[seed % topics.length];
    const difficulty = ['easy', 'medium', 'hard'][seed % 3];

    const prompt = `Generate a DSA coding problem for today's daily challenge:
Topic: ${topic}
Difficulty: ${difficulty}

Return JSON:
{
  "title": "Problem Title",
  "description": "problem description",
  "examples": [{"input": "input", "output": "output", "explanation": "why"}],
  "constraints": ["constraint1"],
  "hints": ["hint1"],
  "approach": "brief approach explanation",
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)"
}`;

    const aiResponse = await getAIResponse(prompt);
    const challenge = extractJSON(aiResponse);

    res.json({ success: true, challenge: { ...challenge, topic, difficulty, date: today } });
  } catch (error) {
    next(error);
  }
};
