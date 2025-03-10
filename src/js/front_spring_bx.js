async function fetchRandomId() {
  try {
    const response = await fetch('https://27a898b3ed8e.ngrok.app/rand_id');
    // const response = await fetch('/randomid.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const randomId = data.random_id;
    console.log("Fetched randomId:", randomId);
    const inputElement = document.getElementById("randomIdInput");
    if (inputElement) {
      inputElement.value = randomId;
      // 선택적으로 sessionStorage에도 저장합니다.
      sessionStorage.setItem("random_id", randomId);
      console.log("Updated element:", inputElement);
    } else {
      console.error('Element with id "randomIdInput" not found.');
    }

  return randomId;
  } catch (error) {
  console.error('Error:', error);
  }
}

function login() {

  document.getElementById("main_wrap").classList.add("consulting_start");
  document.getElementById("step1").classList.add("active");
}
