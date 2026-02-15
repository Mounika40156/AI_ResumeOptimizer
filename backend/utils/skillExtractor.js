/**
 * Predefined skill database
 * Organized by categories
 */
const skillDatabase = {
  frontend: [
    'react', 'angular', 'vue', 'html', 'css', 'javascript', 'typescript',
    'tailwind', 'bootstrap', 'scss', 'sass', 'next.js', 'nuxt', 'jquery'
  ],
  backend: [
    'node.js', 'nodejs', 'express', 'django', 'flask', 'java', 'python',
    'php', 'ruby', 'rails', 'fastapi', 'spring', 'asp.net', 'kotlin'
  ],
  databases: [
    'mongodb', 'mysql', 'postgresql', 'sql', 'firebase', 'dynamodb',
    'redis', 'cassandra', 'elasticsearch', 'oracle', 'sqlite'
  ],
  devops: [
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'jenkins',
    'github', 'gitlab', 'terraform', 'ansible', 'devops'
  ],
  tools: [
    'git', 'webpack', 'babel', 'npm', 'yarn', 'vscode', 'postman',
    'jira', 'slack', 'confluence', 'figma', 'graphql', 'rest'
  ],
  languages: [
    'english', 'spanish', 'french', 'german', 'hindi', 'chinese', 'arabic'
  ],
  other: [
    'agile', 'scrum', 'rest api', 'microservices', 'machine learning',
    'data science', 'ml', 'ai', 'testing', 'jest', 'mocha', 'testing library'
  ]
};

/**
 * Extract skills from resume text
 * @param {string} resumeText - Cleaned resume text
 * @returns {Object} - Extracted skills organized by category
 */
const extractSkills = (resumeText) => {
  const extractedSkills = {};
  const foundSkills = {
    frontend: [],
    backend: [],
    databases: [],
    devops: [],
    tools: [],
    languages: [],
    other: []
  };

  for (const [category, skills] of Object.entries(skillDatabase)) {
    skills.forEach(skill => {
      // Create regex to match skill as whole word
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      if (regex.test(resumeText)) {
        foundSkills[category].push(skill);
      }
    });
  }

  return foundSkills;
};

/**
 * Get all unique skills from extracted skills
 */
const getAllSkills = (extractedSkills) => {
  return Object.values(extractedSkills).flat();
};

/**
 * Get missing skills based on job description or profile target
 * @param {Array} detectedSkills - Skills found in resume
 * @param {Array} requiredSkills - Skills you want the user to have
 * @returns {Array} - Missing skills
 */
const getMissingSkills = (detectedSkills, requiredSkills) => {
  const detectedLower = detectedSkills.map(s => s.toLowerCase());
  return requiredSkills.filter(
    skill => !detectedLower.includes(skill.toLowerCase())
  );
};

/**
 * Get skill recommendations for profile level
 * @param {string} profileLevel - 'junior', 'mid', 'senior'
 * @returns {Object} - Recommended skills by category
 */
const getRecommendedSkillsByLevel = (profileLevel) => {
  const recommendations = {
    junior: {
      frontend: ['react', 'html', 'css', 'javascript'],
      backend: ['node.js', 'express'],
      databases: ['mongodb', 'mysql'],
      devops: ['git', 'docker'],
      tools: ['npm', 'postman'],
      other: ['rest api', 'testing']
    },
    mid: {
      frontend: ['react', 'typescript', 'tailwind', 'next.js'],
      backend: ['node.js', 'express', 'python', 'flask'],
      databases: ['mongodb', 'postgresql', 'redis'],
      devops: ['docker', 'git', 'ci/cd'],
      tools: ['graphql', 'jest', 'postman'],
      other: ['microservices', 'agile', 'rest api']
    },
    senior: {
      frontend: ['react', 'typescript', 'next.js', 'performance'],
      backend: ['node.js', 'python', 'java', 'microservices'],
      databases: ['postgresql', 'mongodb', 'redis', 'elasticsearch'],
      devops: ['docker', 'kubernetes', 'aws', 'ci/cd'],
      tools: ['graphql', 'jest', 'webpack'],
      other: ['architecture', 'agile', 'system design', 'mentoring']
    }
  };

  return recommendations[profileLevel] || recommendations.mid;
};

/**
 * Create detailed skill analysis report
 */
const generateSkillAnalysis = (extractedSkills, profileLevel = 'mid') => {
  const recommendedSkills = getRecommendedSkillsByLevel(profileLevel);
  const detectedSkills = getAllSkills(extractedSkills);

  const analysis = {
    detectedSkills: extractedSkills,
    totalSkillsFound: detectedSkills.length,
    recommendations: {},
    missingSkills: {}
  };

  // Compare with recommendations
  for (const [category, recommended] of Object.entries(recommendedSkills)) {
    const detected = extractedSkills[category] || [];
    const missing = recommended.filter(
      skill => !detected.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );

    analysis.missingSkills[category] = missing;
    analysis.recommendations[category] = {
      recommended,
      detected,
      coverage: `${detected.length}/${recommended.length}`
    };
  }

  return analysis;
};

module.exports = {
  extractSkills,
  getAllSkills,
  getMissingSkills,
  getRecommendedSkillsByLevel,
  generateSkillAnalysis,
  skillDatabase
};