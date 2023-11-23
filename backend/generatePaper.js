const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const questions = JSON.parse(fs.readFileSync("questions.json", "utf8"));

function selectQuestionsForDifficulty(difficulty, totalMarksForDifficulty) {
  const availableQuestions = questions.filter(
    (q) => q.difficulty === difficulty
  );
  let selectedQuestions = [];
  let marksCount = 0;

  for (let question of availableQuestions) {
    if (marksCount + question.marks <= totalMarksForDifficulty) {
      selectedQuestions.push(question);
      marksCount += question.marks;
    }

    if (marksCount >= totalMarksForDifficulty) break;
  }

  return { selectedQuestions, marksCount };
}

function generateQuestionPaper(totalMarks, difficultyDistribution) {
  let questionPaper = [];
  let totalMarksCount = 0;

  for (const [difficulty, percentage] of Object.entries(
    difficultyDistribution
  )) {
    const totalMarksForDifficulty = totalMarks * (percentage / 100);
    const { selectedQuestions, marksCount } = selectQuestionsForDifficulty(
      difficulty,
      totalMarksForDifficulty
    );

    questionPaper.push(...selectedQuestions);
    totalMarksCount += marksCount;
  }

  if (totalMarksCount !== totalMarks) {
    console.log(
      "Warning: Unable to meet exact marks criteria. Total marks of generated paper:",
      totalMarksCount
    );
  }

  return questionPaper;
}

function promptUserAndGeneratePaper() {
  rl.question(
    "Enter total marks for the question paper: ",
    (totalMarksInput) => {
      rl.question(
        "Enter difficulty distribution in format (Easy,Medium,Hard): ",
        (distributionInput) => {
          const totalMarks = parseInt(totalMarksInput);
          const distributionParts = distributionInput.split(",");
          const difficultyDistribution = {
            Easy: parseInt(distributionParts[0]),
            Medium: parseInt(distributionParts[1]),
            Hard: parseInt(distributionParts[2]),
          };

          const paper = generateQuestionPaper(
            totalMarks,
            difficultyDistribution
          );
          console.log("Generated Question Paper:", paper);

          rl.close();
        }
      );
    }
  );
}

promptUserAndGeneratePaper();
