  const axios = require("axios");

  async function analyzeWithAI(resumeText, jobDescription) {
    const prompt = `You are an ATS resume expert and career coach. Analyze the provided resume against the job description and provide detailed recommendations.

  JOB DESCRIPTION:
  ${jobDescription}

  ---

  RESUME:
  ${resumeText}

  ---

  Please provide the analysis in the following JSON format ONLY (no other text):
  {
    "matchPercentage": <number 0-100>,
    "summary": "<brief overall assessment>",
    "requiredSkills": [
      {
        "skill": "<skill name>",
        "found": <boolean>,
        "importance": "<high|medium|low>",
        "suggestion": "<how to add/improve this skill in resume>"
      }
    ],
    "missingSkills": [
      {
        "skill": "<skill name>",
        "importance": "<high|medium|low>",
        "suggestion": "<where and how to add this skill>"
      }
    ],
    "strengths": [
      "<existing strength that aligns well>"
    ],
    "improvementAreas": [
      {
        "area": "<area to improve>",
        "currentState": "<what's currently in resume>",
        "suggestion": "<specific improvement>"
      }
    ],
    "recommendedChanges": [
      {
        "sectionName": "<section like Experience, Skills, Summary>",
        "change": "<specific change to make>",
        "reason": "<why this change matters for this JD>",
        "priority": "<high|medium|low>"
      }
    ],
    "overallFeedback": "<detailed paragraph with actionable advice>"
     "improvedResume": "FULL UPDATED RESUME TEXT"


  }`;

    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",   // 🔥 best for analysis
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseText = response.data.choices[0].message.content;

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse JSON response");
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("Groq Analysis Error:", error.response?.data || error.message);
      throw new Error("Failed to analyze resume");
    }
  }

  module.exports = { analyzeWithAI };
