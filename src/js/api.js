async function generateRandomId() {
  try {
    const url = `https://148a-220-118-59-188.ngrok-free.app/api/rand_id?nocache=${Date.now()}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = JSON.parse(responseText);
    const randomId = data.random_id;
    console.log(randomId);

    document.getElementById("randomIdInput").value = randomId;
    sessionStorage.setItem("random_id", randomId);
  } catch (error) {
    console.error("Error:", error);
  }
}
