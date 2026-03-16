# AI Question Generation Simplification - MANUAL FIX REQUIRED

## Status: File corrupted during editing - requires manual fix

The routes.ts file became corrupted with duplicate code during the editing process.
Git has no commits so we cannot restore.

## Required Manual Fix:

### File: KiwiQA-Online/server/routes.ts

The AI section (lines ~1510-1770 in original) contains:
1. Old batch generation code with BATCH_SIZE, MAX_BATCHES
2. Duplicate function definitions
3. Unnecessary fallback providers (OpenAI, Pollinations, local template)

### Solution:
Replace the entire AI section from "// ============ AI QUESTION GENERATION ROUTES ============" 
to "// ============ CAMERA STREAMING ROUTES ============" with the simplified version below:

```typescript
  // ============ AI QUESTION GENERATION ROUTES ============
  
  // Target questions to generate (exactly 100)
  const TARGET_QUESTIONS = 100;
  
  // Helper function to strip leading numbers from question text
  function cleanQuestionText(text: string): string {
    if (!text) return text;
    return text.replace(/^[\d\.]+\s*[\)\]]*\s*/, '').trim();
  }

  // Generate questions using Google Gemini AI only (gemini-2.5-flash model)
  app.post("/api/admin/generate-questions", authenticateJWT, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { topic, difficulty, numberOfQuestions, examId } = req.body;
      
      if (!topic || !difficulty) {
        return res.status(400).json({ message: "Topic and difficulty are required" });
      }

      const requestedCount = parseInt(numberOfQuestions) || TARGET_QUESTIONS;
      const questionsToGenerate = Math.min(requestedCount, TARGET_QUESTIONS);
      
      console.log(`[AI] Generating exactly ${questionsToGenerate} questions about "${topic}" with ${difficulty} difficulty`);

      const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
      
      if (!GEMINI_API_KEY) {
        return res.status(500).json({ 
          message: "GEMINI_API_KEY not configured. Please set it in environment variables.",
          suggestManual: true
        });
      }

      const model = "gemini-2.5-flash";
      const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const prompt = `Generate exactly ${questionsToGenerate} multiple choice questions about "${topic}" with ${difficulty} difficulty level.
        
For each question, provide:
- question: The question text (clear and concise)
- optionA, optionB, optionC, optionD: Four distinct options
- correctAnswer: The correct answer (A, B, C, or D)
- marks: Mark for each question (1 for easy, 2 for medium, 3 for hard)

Respond ONLY with a JSON array in this exact format:
[
  {"question": "Question 1", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": "A", "marks": 1},
  {"question": "Question 2", "optionA": "Option A", "optionB": "Option B", "optionC": "Option C", "optionD": "Option D", "correctAnswer": "B", "marks": 1}
]

Do NOT include:
- Any numbering in the question text (like "1. What is...")
- Any introductory text or explanations
- Any markdown formatting

Start directly with [ and end with ]. Ensure exactly ${questionsToGenerate} questions in the array.`;

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 65000,
          topP: 0.95,
          topK: 40
        }
      };

      console.log(`[AI - Gemini] Calling ${model} API for ${questionsToGenerate} questions...`);

      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          return res.status(500).json({ 
            message: "AI quota exceeded. Please wait or get a new API key.",
            details: "Get a new key from https://aistudio.google.com/app/apikey",
            suggestManual: true
          });
        }
        
        return res.status(500).json({ 
          message: "AI service error: " + (errorData.error?.message || response.statusText),
          suggestManual: true
        });
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        return res.status(500).json({ message: "Invalid response from AI service", suggestManual: true });
      }
      
      const textResponse = data.candidates[0].content.parts[0].text;
      
      let generatedQuestions: any[] = [];
      let jsonMatch = textResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        generatedQuestions = JSON.parse(jsonMatch[0]);
      } else {
        generatedQuestions = JSON.parse(textResponse);
      }
      
      console.log(`[AI - Gemini] Successfully generated ${generatedQuestions.length} questions`);

      const validAnswers = ["A", "B", "C", "D"];
      const validQuestions = generatedQuestions.filter((q: any) => 
        q.question && q.optionA && q.optionB && q.optionC && q.optionD &&
        validAnswers.includes(q.correctAnswer?.toUpperCase())
      ).map((q: any) => ({
        question: cleanQuestionText(q.question),
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer?.toUpperCase(),
        marks: q.marks || 1
      }));

      if (validQuestions.length === 0) {
        return res.status(400).json({ message: "No valid questions generated. Please try a different topic." });
      }

      if (examId) {
        const exam = await storage.getExam(examId);
        if (!exam) {
          return res.status(404).json({ message: "Exam not found" });
        }

        let insertedCount = 0;
        for (const q of validQuestions) {
          try {
            await storage.createQuestion({
              examId,
              questionText: q.question,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctAnswer: q.correctAnswer,
              marks: q.marks
            });
            insertedCount++;
          } catch (err) {
            console.error("[AI] Error saving question:", err);
          }
        }

        res.status(200).json({
          message: "Questions generated and saved successfully",
          questionsGenerated: validQuestions.length,
          questionsSaved: insertedCount,
          questions: validQuestions
        });
      } else {
        res.status(200).json({
          message: "Questions generated successfully",
          questionsGenerated: validQuestions.length,
          questions: validQuestions
        });
      }
    } catch (err: any) {
      console.error("[AI] Generate questions error:", err);
      res.status(500).json({ message: "Internal server error: " + err.message });
    }
  });
```

## Changes Summary:
- Uses only Google Gemini API (gemini-2.5-flash model)
- Generates exactly 100 questions in ONE request (no batches)
- Removes OpenAI, Pollinations, and local template fallbacks
- Valid JSON array response format
- Each question has: question, optionA-D, correctAnswer, marks

