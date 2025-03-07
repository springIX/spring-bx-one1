
async function fetchReport() {
  try {
    const input1 = document.getElementById("input1").value;
    const input2 = document.getElementById("input2").value;
    const input3 = document.getElementById("input3").value;

    const requestData = {
      product_name: input1,
      usp_text: input2,
      user_query: input3
    };

    const response = await fetch('/bx_architect_report2.json');
    // const response = await fetch('https://7080-220-118-59-188.ngrok-free.app/bx_one', { // 실제 데이터 API 엔드포인트 사용
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(requestData)
    // });

    if (!response.ok) {
      const errorText = await response.text(); // 오류 내용 출력
      console.error("서버 응답 오류:", response.status, errorText);
      throw new Error(`JSON 데이터를 불러오는 데 실패했습니다. 상태 코드: ${response.status}`);
    }

    const data = await response.json();
    console.log("서버 응답 데이터 확인:", data);

    if (Object.keys(data).length === 0) {
      alert("서버에서 받은 JSON 데이터가 비어 있습니다.");
      return;
    }

    window.reportData = data; // 전역 변수에 데이터 저장

    let finalReportOutput = "";
    let resultDataOutput = "";

    document.getElementById("final_report").innerHTML = "";
    document.getElementById("result_data").innerHTML = "";

    // 사용자 입력 데이터 표시
    resultDataOutput += `<h3>사용자 입력 데이터</h3>`;
    resultDataOutput += `<p>1단계 입력: <strong>${input1 || "입력 없음"}</strong></p>`;
    resultDataOutput += `<p>2단계 입력: <strong>${input2 || "입력 없음"}</strong></p>`;
    resultDataOutput += `<p>3단계 입력: <strong>${input3 || "입력 없음"}</strong></p>`;

    // social_report 처리
    if (data.social_report) {
      const lines = data.social_report.split("\n");

      lines.forEach(paragraph => {
        if (paragraph.startsWith("# ")) {
          finalReportOutput += `<h2>${paragraph.replace("#", "").trim()}</h2>`;
        } else if (paragraph.startsWith("## ")) {
          finalReportOutput += `<h3>${paragraph.replace("##", "").trim()}</h3>`;
        } else if (paragraph.startsWith("### ")) {
          finalReportOutput += `<h4>${paragraph.replace("###", "").trim()}</h4>`;
        } else if (paragraph.startsWith("- ['")) {
          const link = paragraph.match(/\['(.+?)'\]/);
          if (link) {
            finalReportOutput += `<p><a href="${link[1]}" target="_blank">${link[1]}</a></p>`;
          }
        } else if (paragraph.trim() !== "") {
          finalReportOutput += `<p>${paragraph.trim()}</p>`;
        }
      });
    }

    document.getElementById("result_data").innerHTML = resultDataOutput;
    document.getElementById("final_report").innerHTML = finalReportOutput;

    console.log("JSON 데이터 로드 완료:", finalReportOutput);
  } catch (error) {
    console.error("fetchReport 오류:", error);
  }
}

function startConsulting() {
  document.getElementById("main").classList.add("hidden");
  document.getElementById("step1").classList.remove("hidden");
}

// 예시보기 문구들
const example_txt_name = [
  "이에르 커피",
  "블렌드엑스 종합광고대행사",
  "퓨전미식당",
  "네이처뷰 화장품",
  "이지핏 피트니스 센터",
  "에코홈 인테리어",
  "트렌디 마켓",
  "스마트러닝 교육 플랫폼",
  "하모니 오디오",
  "비전 테크솔루션"
];
const example_txt_benefit = [
  "챔피언 바리스타의 신선 로스팅 · 깊은 풍미 에스프레소",
  "소비자 인사이트 · 차별화 크리에이티브 광고",
  "현지 재료 + 세계 요리의 독창적 퓨전",
  "100% 자연 유래 · 민감 피부 안전 · 본연의 아름다움",
  "최신 기구 & 전문 트레이너 · 맞춤 운동 프로그램",
  "친환경 소재 + 최신 디자인 · 지속 가능한 인테리어",
  "최신 유행 아이템 · 합리적 가격 · 다채로운 구성",
  "AI 맞춤 교육 · 학습 효율 극대화",
  "최첨단 음향 기술 · 세련된 디자인",
  "맞춤형 IT 솔루션 · 디지털 전환 · 경쟁력 강화"
];
const example_txt_choose = [
  ["카페에서 커피를 선택할 때 가장 중요하게 고려하는 요소는 무엇인가요?",
    "바리스타의 로스팅 기술이나 전문성이 구매 결정에 영향을 주나요?",
    "커피의 산미, 고소함, 향 등 어떤 맛 프로필을 선호하시나요?",
    "신선하게 로스팅된 원두의 맛이 구매 의사에 어떤 영향을 미치나요?"],

  ["광고대행사를 선택할 때 가장 중요하게 고려하는 기준은 무엇인가요?",
    "서비스 비용, 과거 캠페인 성공 사례, 크리에이티브 제안 중 어떤 요소가 가장 큰 영향을 미치나요?",
    "의뢰 시, 광고대행사의 전략적 접근 방식이나 고객 맞춤형 서비스에 대해 어떻게 평가하시나요?",
    "광고 파트너 선정 과정에서 개선되었으면 하는 점은 무엇인가요?"],

  ["퓨전 요리를 선택할 때 가장 매력적으로 느끼는 요소는 무엇인가요?",
    "현지 재료와 국제 요리법의 조화에 대해 어떻게 생각하시나요?",
    "새로운 맛의 경험과 전통적인 맛 중 어느 쪽에 더 큰 가치를 두시나요?",
    "메뉴 구성이나 가격대는 선택에 어떤 영향을 미치나요?"],

  ["화장품 선택 시 자연 유래 성분의 비중은 어느 정도인가요?",
    "피부에 자극 없이 효과를 느낄 수 있는 제품에 대해 어떻게 평가하시나요?",
    "제품의 가격대와 품질 사이의 균형에 대해 어떤 기대를 가지시나요?",
    "패키지 디자인이나 브랜드 신뢰도가 구매 결정에 미치는 영향은 어느 정도인가요?"],

  ["피트니스 센터를 선택할 때 가장 중요하게 고려하는 요소는 무엇인가요?",
    "최신 운동기구와 전문 트레이너의 역할이 얼마나 중요하다고 생각하시나요?",
    "맞춤형 운동 프로그램의 효과와 만족도에 대해 어떻게 평가하시나요?",
    "운영 시간, 위치, 멤버십 비용 등 기타 요소도 선택에 영향을 미치나요?"],

  ["인테리어를 선택할 때 친환경 소재 사용 여부가 중요한 결정 요소인가요?",
    "최신 디자인 트렌드와 친환경 요소의 조화에 대해 어떻게 생각하시나요?",
    "실내 공기질, 에너지 효율성 등 지속 가능성이 주는 장점을 어느 정도 고려하시나요?",
    "예산과 친환경 디자인 사이에서 우선 순위는 어떻게 결정하시나요?"],

  ["온라인 쇼핑 시 가장 중요하게 생각하는 요소는 무엇인가요?",
    "최신 유행 아이템에 대한 기대와 실제 구매 경험은 어떻게 일치하나요?",
    "상품 가격, 품질, 고객 리뷰 중 어떤 요소가 구매 결정에 가장 큰 영향을 미치나요?",
    "쇼핑몰의 상품 구성과 추천 시스템에 대해 어떻게 평가하시나요?"],

  ["맞춤형 교육 프로그램이 학습 성과에 미치는 영향에 대해 어떻게 생각하시나요?",
    "AI 기반 추천 시스템이 개인 학습에 얼마나 도움이 되었나요?",
    "플랫폼 사용 중 가장 만족스러웠던 기능과 개선되었으면 하는 부분은 무엇인가요?",
    "학습 진도 관리와 피드백 시스템이 학습 동기 부여에 미치는 영향은 어느 정도인가요?"],

  ["오디오 제품 구매 시 가장 중요한 기준은 무엇인가요?",
    "음향 기술과 제품 디자인 중 어느 쪽이 구매 결정에 더 큰 영향을 미치나요?",
    "실내 환경에 최적화된 음향 성능에 대한 만족도는 어느 정도인가요?",
    "가격 대비 성능과 디자인 만족도에 대해 어떻게 평가하시나요?"],

  ["IT 솔루션 제공업체 선정 시 가장 중점을 두는 요소는 무엇인가요?",
    "과거의 성공 사례와 맞춤형 서비스 제공이 의사결정에 미치는 영향은 어느 정도인가요?",
    "비용, 기술 지원, 프로젝트 관리 등 각각의 요소에 대해 어떻게 평가하시나요?",
    "디지털 전환을 추진하면서 가장 필요로 하는 지원은 무엇이라고 생각하시나요?"]
];

// 중복 없이 무작위로 4개 선택하는 함수
function getRandomItems(array, count) {
  let shuffled = array.slice().sort(() => 0.5 - Math.random()); // 배열 섞기
  return shuffled.slice(0, count); // 앞에서 4개 선택
}

// 제품명 예시보기 추출
function insertExampleName() {
  const exampleList = document.querySelector('.example_list[data-toggle="brand_name"]');
  if (!exampleList) return;

  let selectedItems = getRandomItems(example_txt_name, 4); // 4개 선택

  exampleList.innerHTML = ""; // 기존 내용 초기화
  selectedItems.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item;
    exampleList.appendChild(li);
  });
}

// 특장점 예시보기 추출
function insertExampleBenefit() {
  const exampleList = document.querySelector('.example_list[data-toggle="brand_benefit"]');
  if (!exampleList) return;

  let selectedItems = getRandomItems(example_txt_benefit, 4); // 4개 선택

  exampleList.innerHTML = ""; // 기존 내용 초기화
  selectedItems.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item;
    exampleList.appendChild(li);
  });
}

// 선택해야 하는 이유 예시보기 추출
function getRandomQuestions(array) {
  return array.map(group => group[Math.floor(Math.random() * group.length)]);
}

function insertExampleChoose() {
  const exampleList = document.querySelector('.example_list[data-toggle="example_txt_choose"]');
  if (!exampleList) return;

  let selectedQuestions = getRandomQuestions(example_txt_choose); // 각 묶음에서 하나씩 선택

  exampleList.innerHTML = ""; // 기존 내용 초기화
  selectedQuestions.forEach(question => {
    let li = document.createElement("li");
    li.textContent = question;
    exampleList.appendChild(li);
  });
}

// 실행
insertExampleName();
insertExampleBenefit();
insertExampleChoose();

// 값 전달 후 이동
function nextStep(currentStep) {
  document.getElementById(`step${currentStep}`).classList.add('hidden');
  let nextStepElement = document.getElementById(`step${currentStep + 1}`);
  if (nextStepElement) {
    nextStepElement.classList.remove('hidden');
    nextStepElement.classList.add('active');
  }

  // lnb
  let surveyLnb = document.querySelectorAll('.survey_lnb li');
  if (surveyLnb[currentStep - 1]) {
    surveyLnb[currentStep - 1].classList.add('on');

    // 클릭한 버튼의 형제 input 값을 가져오기
    let buttonClicked = event.target; // 클릭된 버튼
    let inputField = buttonClicked.previousElementSibling; // 형제 input 요소 찾기

    if (inputField && inputField.classList.contains("answer_input")) {
      surveyLnb[currentStep - 1].querySelector("button").textContent = inputField.value;
    }
  }
}

//단순이동
function nextStep_lnb(currentStep) {
  document.querySelectorAll('.survey_box').forEach(box => {
    box.classList.add('hidden');
  });
  let nextStepElement = document.getElementById(`step${currentStep + 1}`);
  if (nextStepElement) {
    nextStepElement.classList.remove('hidden');
    nextStepElement.classList.add('active');
  }
}


const inputFields = document.querySelectorAll(".answer_input");

inputFields.forEach((inputField, index) => {
  let hasValue = false;
  let nxtBtn = inputField.nextElementSibling;

  inputField.addEventListener("input", function () {
    const currentValue = inputField.value.trim();
    if (currentValue === "" && hasValue) {
      hasValue = false;
      nxtBtn.disabled = true;
    } else if (currentValue !== "" && !hasValue) {
      hasValue = true;
      nxtBtn.disabled = false;
    }
  });
});



function submitForm() {
  document.getElementById("step3").classList.add("hidden");
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("loading").classList.add("active");
  document.getElementById("main_wrap").classList.add("consulting_end");

  let buttonClicked = event.target;
  let inputField = buttonClicked.previousElementSibling;
  let lastLnb = document.querySelector(".survey_lnb ol li:last-child");
  lastLnb.querySelector("button").textContent = inputField.value;
  lastLnb.classList.add('on');

  let progressBar = document.getElementById("progress-bar");
  let progressText = document.getElementById("progress-text");
  let resultButton = document.getElementById("result-button");

  // 60초(60000ms) ~ 120초(120000ms) 사이의 랜덤 시간 선택
  let duration = Math.floor(Math.random() * (120 - 60 + 1) + 60);
  // let intervalTime = (duration * 1000) / 100; // 1%씩 업데이트 (전체 지속 시간에 맞춤)
  let intervalTime = 10;
  let progress = 0;

  // 로딩이 진행되는 동안 JSON 데이터를 가져옴
  let fetchPromise = fetchReport();

  // 랜덤 텍스트 : 로딩 중 일때
  const loadingTxt = [
    ["1-1번째텍스트", "1-2번째텍스트", "1-3번째텍스트", "1-5번째텍스트", "1-5번째텍스트"],
    ["2-1번째텍스트", "2-2번째텍스트", "2-3번째텍스트", "2-5번째텍스트", "2-5번째텍스트"],
    ["3-1번째텍스트", "3-2번째텍스트", "3-3번째텍스트", "3-5번째텍스트", "3-5번째텍스트"],
    ["4-1번째텍스트", "4-2번째텍스트", "4-3번째텍스트", "4-5번째텍스트", "4-5번째텍스트"]
  ];
  const loadingRandPick = loadingTxt.map(group =>
    group[Math.floor(Math.random() * group.length)]
  );


  // 텍스트가 표시될 요소
  const displayElement = document.getElementById("loading_info");

  // 초기값 (첫 번째 그룹에서 무작위 선택)
  displayElement.textContent = loadingTxt[0][Math.floor(Math.random() * loadingTxt[0].length)];

  let changePoints = [
    Math.floor(Math.random() * (30 - 20 + 1)) + 20,
    Math.floor(Math.random() * (55 - 45 + 1)) + 45,
    Math.floor(Math.random() * (80 - 70 + 1)) + 70
  ];

  let interval = setInterval(() => {
    progress += 1;
    progressBar.style.width = progress + "%";
    progressText.innerText = progress + "%";

    if (progress === changePoints[0]) {
      displayElement.textContent = loadingTxt[1][Math.floor(Math.random() * loadingTxt[1].length)];
    }
    if (progress === changePoints[1]) {
      displayElement.textContent = loadingTxt[2][Math.floor(Math.random() * loadingTxt[2].length)];
    }
    if (progress === changePoints[2]) {
      displayElement.textContent = loadingTxt[3][Math.floor(Math.random() * loadingTxt[3].length)];
    }

    if (progress >= 100) {
      clearInterval(interval);

      // JSON 요청 완료 후 UI 업데이트
      fetchPromise.then(() => {
        document.getElementById("result-button").classList.add("on");
      }).catch(error => {
        console.error("데이터 로딩 중 오류 발생:", error);
        document.getElementById("loading").classList.add("hidden");
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      });
    }
  }, intervalTime);
}



function showResult() {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("result-page").classList.remove("hidden");
  document.getElementById("result-button").classList.add("hidden");
}

async function generatePDFWithUserInput(buttonIndex) {
  try {

    if (!window.reportData) {
      console.error("🚨 JSON 데이터가 로드되지 않았습니다.");
      alert("JSON 데이터를 먼저 불러와 주세요.");
      return;
    }

    const templateUrl = "/src/documents/test1.pdf";
    const response = await fetch(templateUrl);
    if (!response.ok) throw new Error("PDF 템플릿을 불러오지 못했습니다.");
    const templateBytes = await response.arrayBuffer();

    const { PDFDocument, rgb } = PDFLib;
    const pdfDoc = await PDFDocument.load(templateBytes);

    // 폰트 로드 및 등록
    const fontkitModule = await import('https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@0.0.4/+esm');
    pdfDoc.registerFontkit(fontkitModule.default);
    const fontUrl = "/src/font/pretendard/Pretendard-Regular.ttf";
    const fontBytes = await (await fetch(fontUrl)).arrayBuffer();
    const customFont = await pdfDoc.embedFont(fontBytes);
    const fontUrlBold = "/src/font/pretendard/Pretendard-Bold.ttf";
    const fontBytesBold = await (await fetch(fontUrlBold)).arrayBuffer();
    const customFontBold = await pdfDoc.embedFont(fontBytesBold);

    let pages = pdfDoc.getPages();
    let coverPage = pages[0];
    let listPage = pages[1];
    let resultPage = pages[2];
    let finalReportPage = pages[3];
    let citationPage = pages[5];
    let brandingPage = pages[7]
    let IdentityPage = pages[8]

    let finalReportY = 600;
    let xMargin = 60;
    const maxY = 50;
    const lineHeight = 30;
    let pageIndex = 3;
    const maxTextWidth = 1000;
    const pinkColor = rgb(1, 0.082, 0.52);

    // 사용자 입력 값 가져오기
    const step1 = document.getElementById("input1").value || "입력값 없음";
    const step2 = document.getElementById("input2").value || "입력값 없음";
    const step3 = document.getElementById("input3").value || "입력값 없음";
    const btnTxtData = {
      compounds: {
        button_text: [
          { btnTxt: "1. Brand Identity Report" },
          { btnTxt: "2. Brand Identity Report" },
          { btnTxt: "3. Brand Identity Report" },
          { btnTxt: "4. Brand Identity Report" },
          { btnTxt: "5. Brand Identity Report" }
        ]
      }
    };


    // JSON 데이터 가져오기
    const jsonData = window.reportData;
    const emoFunc = jsonData.compounds.emo_func_benefits[buttonIndex] || {};
    const keyword = jsonData.compounds.compound_keywords[buttonIndex] || {};
    const mktState = jsonData.compounds.mkt_state[buttonIndex] || {};
    const btnTxt = btnTxtData.compounds.button_text[buttonIndex] || {};
    const socialReport = jsonData.social_report || "최종 보고서 없음";

    function wrapFinalReportText(text, maxWidth, fontSize) {
      let lines = [];
      let currentLine = "";

      for (let i = 0; i < text.length; i++) {
        let testLine = currentLine + text[i];

        // 대략적인 너비 계산 (글자당 평균 너비 0.5를 가정)
        let textWidth = testLine.length * fontSize * 0.5;

        if (textWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = text[i];
        } else {
          currentLine = testLine;
        }
      }

      lines.push(currentLine);
      return lines;
    }

    function addWrappedText(page, text, x, y, maxWidth, fontSize, font = customFont, color = rgb(1, 1, 1), lineHeight = 28) {
      const wrappedLines = wrapFinalReportText(text, maxWidth, fontSize);
      wrappedLines.forEach(line => {
        page.drawText(line, {
          x,
          y,
          size: fontSize,
          color: color,
          font: font
        });
        y -= lineHeight;
      });
    }


    async function addCenteredWrappedText(page, text, centerX, y, maxWidth, fontSize, font = customFont, color = rgb(1, 1, 1), lineHeight = 28) {
      const wrappedLines = wrapFinalReportText(text, maxWidth, fontSize);
      for (const line of wrappedLines) {
        const textWidth = await font.widthOfTextAtSize(line, fontSize);
        const x = centerX - textWidth / 2;

        page.drawText(line, {
          x,
          y,
          size: fontSize,
          color: color,
          font: font
        });

        y -= lineHeight;
      }
    }


    addWrappedText(coverPage, btnTxt.btnTxt || "", 1465, 740, 300, 25, customFontBold, rgb(1, 1, 1), 25);
    addWrappedText(listPage, btnTxt.btnTxt || "", 1640, 1005, 300, 20, customFontBold, rgb(1, 1, 1), 20);
    addWrappedText(resultPage, btnTxt.btnTxt || "", 1640, 1005, 300, 20, customFontBold, rgb(1, 1, 1), 20);
    addWrappedText(finalReportPage, btnTxt.btnTxt || "", 1640, 1005, 300, 20, customFontBold, rgb(1, 1, 1), 20);
    addWrappedText(brandingPage, btnTxt.btnTxt || "", 1640, 1005, 300, 20, customFontBold, rgb(1, 1, 1), 20);
    addWrappedText(pages[6], btnTxt.btnTxt || "", 1640, 1005, 300, 20, customFontBold, rgb(1, 1, 1), 20);
    addWrappedText(IdentityPage, btnTxt.btnTxt || "", 1640, 1005, 300, 20, customFontBold, rgb(1, 1, 1), 20);


    addWrappedText(resultPage, step1, 62, 688, 300, 24, customFontBold, rgb(1, 1, 1), 34);
    addWrappedText(resultPage, step2, 720, 688, 300, 24, customFontBold, rgb(1, 1, 1), 34);
    addWrappedText(resultPage, step3, 1321, 688, 300, 24, customFontBold, rgb(1, 1, 1), 34);
    addWrappedText(finalReportPage, jsonData.social_report_title || "", 60, 800, 800, 34, customFontBold, rgb(1, 1, 1), 36);
    addWrappedText(finalReportPage, jsonData.social_report_subtitle || "", 64, 740, 800, 25, customFont, rgb(1, 1, 1), 30);
    addWrappedText(citationPage, jsonData.citation || "", 64, 800, 1000, 20, customFont, rgb(1, 1, 1), 26);


    addWrappedText(brandingPage, keyword.korean || "", 119, 825, 300, 20, customFontBold, rgb(1, 1, 1), 20);
    addWrappedText(brandingPage, keyword.keyword || "", 119, 747, 800, 60, customFont, pinkColor, 72);
    addWrappedText(brandingPage, keyword.explanation || "", 119, 240, 300, 24, customFont, rgb(1, 1, 1), 32);

    addWrappedText(IdentityPage, mktState.marketing_summary || "", 450, 361, 750, 56, customFont, rgb(1, 1, 1), 80);


    addCenteredWrappedText(brandingPage, emoFunc.emotional_benefit || "", 1258, 532, 450, 20, customFont, rgb(1, 1, 1), 32);
    addCenteredWrappedText(brandingPage, emoFunc.functional_benefit || "", 1258, 354, 450, 20, customFont, rgb(1, 1, 1), 32);
    addCenteredWrappedText(brandingPage, (jsonData.compounds.attribute || []).join(", "), 1258, 150, 450, 20, customFont, rgb(1, 1, 1), 32);


    const finalReportLines = socialReport.split("\n");

    finalReportLines.forEach(line => {
      let textSize = 20;
      let indent = xMargin;
      let lineSpacing = lineHeight;

      // 여기서 social_report의 너비만 1000으로 설정
      const wrappedFinalReportLines = wrapFinalReportText(line, 1000, textSize);

      wrappedFinalReportLines.forEach(subLine => {
        if (finalReportY - lineSpacing < maxY) {
          pageIndex += 1;
          finalReportPage = pages[pageIndex] || pdfDoc.addPage([842, 595]);
          finalReportY = 950;
        }

        finalReportPage.drawText(subLine, {
          x: indent,
          y: finalReportY,
          size: textSize,
          font: customFont,
          color: rgb(1, 1, 1),
        });

        finalReportY -= lineSpacing;
      });
    });

    const pdfBytes = await pdfDoc.save();
    openModal(URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" })));
  } catch (error) {
    console.error("PDF 생성 오류:", error);
  }
}

function openModal(pdfUrl) {
  document.getElementById("pdfViewer").src = pdfUrl;
  document.getElementById("pdfModal").style.display = "block";
}

function closeModal() {
  document.getElementById("pdfModal").style.display = "none";
  document.getElementById("pdfViewer").src = "";
}

function downloadPDFForPage(pageIndex) {
  generatePDFWithUserInput(pageIndex);
}
