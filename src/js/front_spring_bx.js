async function fetchRandomId() {
  try {
    // const response = await fetch('https://7844-220-118-59-188.ngrok-free.app/api/rand_id');
    const response = await fetch('/randomid.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();  // data는 { "random_id": "CIwAOKWsK7JB" } 형태의 객체
    const randomId = data.random_id;
    console.log("Fetched randomId:", randomId);

    // HTML 문서 내 id가 "randomIdInput"인 요소의 value 속성을 업데이트합니다.
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
  // const mainElement = document.getElementById("main");
  // const step1Element = document.getElementById("step1");
  // const surveyWrap = document.getElementById("survey_wrap");

  // if (mainElement) {
  //   mainElement.classList.add("hidden");
  // } else {
  //   console.error('Element with id "main" not found.');
  // }

  // if (step1Element) {
  //   step1Element.classList.remove("hidden");
  //   surveyWrap.classList.remove("hidden");
  // } else {
  //   console.error('Element with id "step1" not found.');
  // }

  document.getElementById("main_wrap").classList.add("consulting_start");
  document.getElementById("step1").classList.add("active");
}
