const GEMINI_API_KEY = "AIzaSyB0l_rxCXWJUemZo_sXOoqJzp6I4R4IQ3o";

document.getElementById("clarityForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Collect all form data
  const formData = {
    education: document.getElementById("education").value,
    subjects: document.getElementById("subjects").value,
    hobbies: document.getElementById("hobbies").value,
    skills: document.getElementById("skills").value,
    feelings: document.getElementById("feelings").value,
    challenges: document.getElementById("challenges").value,
    shortGoals: document.getElementById("shortGoals").value,
    longGoals: document.getElementById("longGoals").value,
    achievements: document.getElementById("achievements").value,
    strengths: document.getElementById("strengths").value,
    social: document.getElementById("social").value,
    energy: document.getElementById("energy").value,
  };

  const responseDiv = document.getElementById("response");
  responseDiv.style.display = "block";
  responseDiv.innerHTML =
    '<div class="loading">Advanced AI is analyzing your complete profile and generating personalized guidance...</div>';

  callGeminiAPI(formData);
});

async function callGeminiAPI(data) {
  const prompt = `You are ClarityBot, a friendly AI helper made by college student Hemant Kumar to help other students find their path in life.

Student's Info:
Studies: ${data.education || "Not mentioned"}
Likes: ${data.subjects || "Not mentioned"}
Hobbies: ${data.hobbies || "Not mentioned"}
Want to learn: ${data.skills || "Not mentioned"}
Feelings: ${data.feelings || "Not mentioned"}
Problems: ${data.challenges || "Not mentioned"}
Short goals: ${data.shortGoals || "Not mentioned"}
Big dreams: ${data.longGoals || "Not mentioned"}
Achievements: ${data.achievements || "Not mentioned"}
Strengths: ${data.strengths || "Not mentioned"}
Social: ${data.social || "Not mentioned"}
Energy: ${data.energy || "Not mentioned"}

Create a simple ROADMAP in easy English that:

1. Says something nice about their achievements
2. Understands their feelings
3. Gives a clear step-by-step plan (like a roadmap)
4. Uses simple words that any student can understand
5. Makes them feel motivated

Format your response like this:

GREAT JOB!
[Say something positive about what they've done]

I UNDERSTAND
[Show you understand their feelings]

YOUR ROADMAP TO SUCCESS

STEP 1: [First thing to do this week]
STEP 2: [Second thing to do]
STEP 3: [Third thing to do]
STEP 4: [Fourth thing to do]
STEP 5: [Fifth thing to do]

THINK ABOUT THIS
[Ask one simple question for them to think about]
Give it some resource so where to start 

YOU CAN DO IT!
[End with encouraging words]

Use very simple English. Write like you're talking to a friend. Keep it under 300 words.

End with: "ClarityBot - Made by student Hemant Kumar to help students like you!"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (
      result.candidates &&
      result.candidates[0] &&
      result.candidates[0].content
    ) {
      const aiResponse = result.candidates[0].content.parts[0].text;
      document.getElementById("response").innerHTML = aiResponse.replace(
        /\n/g,
        "<br>"
      );
    } else {
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("API Error:", error);
    document.getElementById("response").innerHTML = `
            <div style="text-align: center;">
                <strong>Connection Error</strong><br><br>
                Unable to connect to AI service.<br>
                Error: ${error.message}<br><br>
                Please check your internet connection and try again.
            </div>
        `;
  }
}
