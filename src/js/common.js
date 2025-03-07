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



// async function login() {
//   const randomId = document.getElementById("randomIdInput").value;

//   if (!randomId) {
//       alert("랜덤 아이디를 먼저 생성하세요.");
//       return;
//   }

//   try {
//       const response = await fetch("https://cd8b-220-118-59-188.ngrok-free.app/rand_id", {
//           method: "ㅖㅒㄴ",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ random_id: randomId })
//       });

//       if (!response.ok) {
//           throw new Error(`로그인 실패 (상태 코드: ${response.status})`);
//       }

//       sessionStorage.setItem("random_id", randomId);
//       document.getElementById("main").classList.add("hidden");
//       document.getElementById("step1").classList.remove("hidden");
//   } catch (error) {
//       console.error("로그인 오류:", error);
//       alert("로그인에 실패했습니다.");
//   }
// }




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

      const response = await fetch('/bx_architect_report2.json', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
      });
      // const response = await fetch('https://148a-220-118-59-188.ngrok-free.app/bx_one', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify(requestData)
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

function nextStep(currentStep) {
  document.getElementById(`step${currentStep}`).classList.add('hidden');
  let nextStepElement = document.getElementById(`step${currentStep + 1}`);
  if (nextStepElement) {
      nextStepElement.classList.remove('hidden');
  }
}

function submitForm() {
  document.getElementById("step3").classList.add("hidden");
  document.getElementById("loading").classList.remove("hidden");

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
            document.getElementById("result-button").classList.remove("hidden");
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

      let pages = pdfDoc.getPages();
      let resultPage = pages[2];
      let finalReportPage = pages[3]; 
      let citationPage = pages[5]; 
      let brandingPage = pages[6]
      let coreKeywordsPage = pages[7]

      let finalReportY = 690;
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

      // JSON 데이터 가져오기
      const jsonData = window.reportData;
      const emoFunc = jsonData.compounds.emo_func_benefits[buttonIndex] || {};
      const keyword = jsonData.compounds.compound_keywords[buttonIndex] || {};
      const marketingSummary = jsonData.compounds.mkt_state[buttonIndex]?.marketing_summary || "마케팅 요약 없음";
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

      function addWrappedText(page, text, x, y, maxWidth, fontSize, color = rgb(1, 1, 1), lineHeight = 28) {
          const wrappedLines = wrapFinalReportText(text, maxWidth, fontSize);
          wrappedLines.forEach(line => {
              page.drawText(line, { x, y, maxWidth, size: fontSize, color: color, lineHeight: lineHeight, font: customFont});
              y -= 28;
          });
      }

      addWrappedText(resultPage, step1, 62, 688, 300, 24, rgb(1, 1, 1), 80);
      addWrappedText(resultPage, step2, 720, 688, 300, 24, rgb(1, 1, 1), 80);
      addWrappedText(resultPage, step3, 1321, 688, 300, 24, rgb(1, 1, 1), 80);
      addWrappedText(finalReportPage, jsonData.social_report_title || "", 60, 802, 800, 34, rgb(1, 1, 1), 36);
      addWrappedText(finalReportPage, jsonData.social_report_subtitle || "", 64, 740, 800, 28, rgb(1, 1, 1), 30);
      addWrappedText(citationPage, jsonData.citation || "", 64, 800, 1000, 20, rgb(1, 1, 1), 26);

      
      addWrappedText(brandingPage, keyword.keyword || "", 450, 890, 800, 50, pinkColor, 50);
      addWrappedText(brandingPage, keyword.korean || "", 450, 537, 800, 80, rgb(1, 1, 1), 80);
      addWrappedText(brandingPage, keyword.explanation || "", 450, 295, 1000, 48, rgb(1, 1, 1), 50);
      addWrappedText(coreKeywordsPage, emoFunc.emotional_benefit || "", 450, 700, 1000, 26, rgb(1, 1, 1), 30);
      addWrappedText(coreKeywordsPage, emoFunc.functional_benefit || "", 450, 450, 1000, 26, rgb(1, 1, 1), 30);
      addWrappedText(coreKeywordsPage, jsonData.attribute || "", 450, 185, 1000, 26, rgb(1, 1, 1), 30);


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