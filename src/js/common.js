
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

    document.getElementById("final_report").innerHTML = "";
    document.getElementById("step1_data").innerHTML = input1 || "입력 없음";
    document.getElementById("step2_data").innerHTML = input2 || "입력 없음";
    document.getElementById("step3_data").innerHTML = input3 || "입력 없음";

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
  // let duration = Math.floor(Math.random() * (120 - 60 + 1) + 60);
  let duration = 1;
  let intervalTime = (duration * 1000) / 100; // 1%씩 업데이트 (전체 지속 시간에 맞춤)
  let progress = 0;

  // 로딩이 진행되는 동안 JSON 데이터를 가져옴
  let fetchPromise = fetchReport();

  let interval = setInterval(() => {
    progress += 1;
    progressBar.style.width = progress + "%";
    progressText.innerText = progress + "%";

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
    
    addWrappedText(IdentityPage, mktState.marketing_summary || "", 450, 550, 760, 56, customFont, rgb(1, 1, 1), 80);
    
    
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
  const pdfViewer = document.getElementById("pdfViewer");
  const downloadBtn = document.querySelector(".pdf_download_btn");

  pdfViewer.src = pdfUrl; // PDF 뷰어에 로드
  downloadBtn.href = pdfUrl; // 다운로드 링크 설정
  downloadBtn.setAttribute("download", "블렌드엑스 종합광고대행사_bx_architect_final_report.pdf"); // 파일 다운로드 설정

  document.getElementById("pdfModal").style.display = "block";
}

function closeModal() {
  document.getElementById("pdfModal").style.display = "none";
  document.getElementById("pdfViewer").src = "";
}

function downloadPDFForPage(pageIndex) {
  generatePDFWithUserInput(pageIndex);
}


// 추가한 코드
