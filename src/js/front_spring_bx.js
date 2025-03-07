async function fetchRandomId() {
  try {
    const response = await fetch('http://127.0.0.1:8010/rand_id');
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
