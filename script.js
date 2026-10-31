
import { pipeline, env } from
"https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2";

// Open-weight model
const MODEL_ID = "Xenova/distilgpt2";

env.allowLocalModels = false;
env.useBrowserCache = true;

const $ = (id) => document.getElementById(id);

const generateBtn = $("generateBtn");
const statusText = $("statusText");
const modelStatus = $("modelStatus");

let generator = null;
let lastIdea = "";

// UPDATE MODEL STATUS
function setStatus(message, state = "loading") {

  statusText.textContent = message;

  const dot = modelStatus.querySelector(".status-dot");

  dot.style.background =
    state === "ready" ? "#9be6ba" :
    state === "error" ? "#ff8f9b" :
    "#b99aff";

  dot.style.boxShadow =
    state === "ready" ? "0 0 8px #9be6ba" :
    state === "error" ? "0 0 8px #ff8f9b" :
    "0 0 8px #b99aff";
}

// SHOW LOADING SCREEN
function showLoading(title, message) {

  $("emptyState").classList.add("hidden");
  $("storyOutput").classList.add("hidden");

  $("loadingState").classList.remove("hidden");

  $("loadingTitle").textContent = title;
  $("loadingMessage").textContent = message;
}

// GENERATE STORY TITLE
function titleFrom(text) {

  const words = text
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);

  return words.length
    ? words.map(w =>
        w[0].toUpperCase() + w.slice(1)
      ).join(" ")
    : "The Last Visitor";
}

// CLEAN GENERATED TEXT
function cleanStory(text, prompt) {

  let result = text.trim();

  if (result.toLowerCase().startsWith(prompt.toLowerCase())) {
    result = result.slice(prompt.length).trim();
  }

  result = result.replace(/^(story|title)\s*:\s*/i, "");

  return result;
}

// LOAD OPEN-SOURCE AI MODEL
async function loadModel() {

  if (generator) return generator;

  setStatus(
    "Downloading the open-weight model. This may take a few minutes on first use."
  );

  generator = await pipeline(
    "text-generation",
    MODEL_ID,
    {
      progress_callback: (progress) => {

        if (progress.status === "progress") {

          const pct = progress.total
            ? Math.round(
                progress.loaded / progress.total * 100
              )
            : 0;

          setStatus(`Downloading model files: ${pct}%`);

        } else if (progress.status === "downloading") {

          setStatus("Downloading model files...");

        } else if (progress.status === "ready") {

          setStatus("Model is ready in your browser.", "ready");
        }
      }
    }
  );

  setStatus("Open model loaded and ready.", "ready");

  return generator;
}

// MAIN STORY GENERATOR
async function generateStory() {

  const idea =
    $("idea").value.trim() ||
    "A lonely lighthouse keeper hears a voice calling from beneath the waves";

  const genre = $("genre").value;
  const length = $("length").value;

  lastIdea = idea;

  generateBtn.disabled = true;

  $("buttonText").textContent =
    "THE SPIRIT IS THINKING...";

  showLoading(
    "Awakening the machine...",
    "The open model is preparing your story. The first visit may take a little while."
  );

  try {

    const ai = await loadModel();

    // Story length settings
    const maxNewTokens =
      length === "short" ? 100 :
      length === "long" ? 220 :
      155;

    // AI prompt
    const prompt =
      `Write an original ${genre} story. ` +
      `Premise: ${idea}. ` +
      `Begin the story immediately. ` +
      `Use vivid, eerie imagery and build suspense. ` +
      `Story:`;

    // Generate story using local AI
    const output = await ai(
      prompt,
      {
        max_new_tokens: maxNewTokens,
        do_sample: true,
        temperature: 0.9,
        top_k: 50,
        repetition_penalty: 1.15,
        return_full_text: false
      }
    );

    let story = cleanStory(
      output[0].generated_text || "",
      prompt
    );

    // Fallback if model output is empty
    if (!story || story.length < 25) {

      story =
        "The lights flickered once. Then again. " +
        "Somewhere beyond the window, something " +
        "that looked almost human stood perfectly still. " +
        "I told myself it was only a shadow. " +
        "The shadow raised its hand and tapped on the glass.";
    }

    // Display generated story
    $("storyTitle").textContent = titleFrom(idea);

    $("storyGenre").textContent =
      genre.toUpperCase();

    $("storyText").textContent = story;

    $("loadingState").classList.add("hidden");

    $("storyOutput").classList.remove("hidden");

    setStatus(
      "Story generated locally in your browser.",
      "ready"
    );

  } catch (error) {

    console.error(error);

    $("loadingState").classList.add("hidden");

    $("emptyState").classList.remove("hidden");

    $("emptyState").querySelector("h3").textContent =
      "The connection faded...";

    $("emptyState").querySelector("p").textContent =
      "The model could not load. Check your internet connection and try again.";

    setStatus(
      "Could not load the model. Check your connection and retry.",
      "error"
    );

  } finally {

    generateBtn.disabled = false;

    $("buttonText").textContent =
      "SUMMON MY STORY";
  }
}

// GENERATE BUTTON
generateBtn.addEventListener(
  "click",
  generateStory
);

// REGENERATE BUTTON
$("againBtn").addEventListener("click", () => {

  $("idea").value = lastIdea;

  generateStory();
});

// COPY STORY BUTTON
$("copyBtn").addEventListener("click", async () => {

  const text =
    `${$("storyTitle").textContent}\n\n` +
    `${$("storyText").textContent}`;

  try {

    await navigator.clipboard.writeText(text);

    $("copyBtn").textContent = "✓ COPIED";

    setTimeout(() => {

      $("copyBtn").textContent = "▣ COPY STORY";

    }, 1600);

  } catch {

    $("copyBtn").textContent =
      "COPY NOT AVAILABLE";
  }
});
