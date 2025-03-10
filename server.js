import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const Thought = mongoose.model('Thought', {
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ["General", "Food", "Project", "Home"],
    default: "General",
  },
  username: {
    type: String,
    default: "Anonymous",
  },
});

// Combine the two GET routes into one
app.get("/thoughts", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {}; 

    const thoughts = await Thought.find(filter)
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();

    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST route to create new thoughts
app.post("/thoughts", async (req, res) => {
  try {
    const { text, category, username } = req.body;

    // Kontrollera om text är tomt (obligatoriskt fält)
    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    // Skapa en ny tanke med rätt fält
    const newThought = new Thought({
      text,
      category,
      username,
    });

    // Försök spara den nya tanken i databasen
    await newThought.save();

    // Skicka tillbaka den skapade tanken som svar
    res.status(201).json(newThought);
  } catch (error) {
    console.error("Error creating thought:", error); // Logga felet på servern för att få mer information
    res.status(500).json({ message: "Error creating thought", error: error.message });
  }
});

// POST route to like a thought (increase hearts)
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.json(thought);
  } catch (error) {
    res.status(500).json({ message: "Error liking thought", error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));