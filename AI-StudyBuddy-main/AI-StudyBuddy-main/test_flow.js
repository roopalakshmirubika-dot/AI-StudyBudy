const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');

(async () => {
  try {
    console.log("1. Registering a test user...");
    const regRes = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Agent Test",
        email: `agent${Date.now()}@test.com`,
        password: "password123",
        role: "student"
      })
    });
    const regData = await regRes.json();
    if (!regData.accessToken) throw new Error("Registration failed: " + JSON.stringify(regData));
    const token = regData.accessToken;
    console.log("   ✅ Success! Got token.");

    console.log("\n2. Uploading a study document...");
    fs.writeFileSync("dummy.txt", "Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.");
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream("dummy.txt"));
    formData.append('title', 'Science Notes');

    const uploadRes = await fetch("http://localhost:5000/api/materials/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.material) throw new Error("Upload failed: " + JSON.stringify(uploadData));
    const materialId = uploadData.material._id;
    console.log(`   ✅ Success! Document uploaded. ID: ${materialId}`);

    console.log("\n3. Generating AI Flashcards...");
    const flashRes = await fetch(`http://localhost:5000/api/materials/${materialId}/flashcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ count: 2 })
    });
    
    const flashData = await flashRes.json();
    console.log("   ✅ AI Response:");
    console.log(JSON.stringify(flashData, null, 2));

  } catch (err) {
    console.error("\n❌ Error during flow:", err.message);
  } finally {
    if (fs.existsSync("dummy.txt")) fs.unlinkSync("dummy.txt");
  }
})();
