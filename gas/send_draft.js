/**
 * SiftTools Daily Growth Report — 초안 자동 발송
 *
 * Gmail 임시보관함에서 [SiftTools Daily] 제목의 초안을 찾아 자동 발송합니다.
 * 매일 09:10 KST에 시간 트리거로 실행됩니다.
 */

function sendSiftToolsDrafts() {
  const SUBJECT_TAG = '[SiftTools Daily]';
  const drafts = GmailApp.getDrafts();
  const chatId = PropertiesService.getScriptProperties().getProperty('CHAT_ID_DANIEL');
  let sentCount = 0;

  drafts.forEach(draft => {
    const message = draft.getMessage();
    const subject = message.getSubject();

    if (subject && subject.includes(SUBJECT_TAG)) {
      const body = message.getPlainBody() || message.getBody().replace(/<[^>]+>/g, '');
      const text = `📄 ${subject}\n\n${body.trim()}`;

      sendTelegram_(chatId, text);
      draft.deleteDraft();
      sentCount++;
      Logger.log('Telegram sent: ' + subject);
    }
  });

  Logger.log('Total drafts sent: ' + sentCount);
}

/**
 * 생각의숲 조사보고서 — 초안 자동 발송
 *
 * Gmail 임시보관함에서 [생각의숲 조사보고서] 제목의 초안을 찾아 자동 발송합니다.
 * [동길] 태그 → to: trip2daniel@gmail.com, cc: 39gambler@gmail.com
 * [은경] 태그 → to: 39gambler@gmail.com, cc: trip2daniel@gmail.com
 * 1시간마다 시간 트리거로 실행됩니다.
 */
/** 텔레그램 메시지 발송 헬퍼 */
function sendTelegram_(chatId, text) {
  const token = PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN');
  if (!token || !chatId) { Logger.log('텔레그램 설정 누락 (TOKEN 또는 CHAT_ID)'); return; }
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ chat_id: chatId, text: text })
  });
}

function sendSaenggakDrafts() {
  const SUBJECT_TAG = '[생각의숲 조사보고서]';
  const drafts = GmailApp.getDrafts();
  const props = PropertiesService.getScriptProperties();
  let sentCount = 0;

  drafts.forEach(draft => {
    const message = draft.getMessage();
    const subject = message.getSubject();

    if (subject && subject.includes(SUBJECT_TAG)) {
      const body = message.getPlainBody() || message.getBody().replace(/<[^>]+>/g, '');
      const text = `📄 ${subject}\n\n${body.trim()}`;

      // 텔레그램으로 본문 발송 (Daniel)
      sendTelegram_(props.getProperty('CHAT_ID_DANIEL'), text);

      // 발송 후 초안 삭제
      draft.deleteDraft();
      sentCount++;
      Logger.log('Telegram sent: ' + subject);
    }
  });

  Logger.log('생각의숲 drafts sent: ' + sentCount);
}

/**
 * 시간 기반 트리거 설정 — 최초 1회 실행
 * sendSiftToolsDrafts: 매일 09:00~09:30 KST
 * sendSaenggakDrafts: 1시간마다
 */
function setupAllTriggers() {
  // 기존 트리거 모두 제거
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });

  // SiftTools: 매일 09:00~09:30 KST
  ScriptApp.newTrigger('sendSiftToolsDrafts')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .nearMinute(15)
    .create();

  // 생각의숲: 1시간마다
  ScriptApp.newTrigger('sendSaenggakDrafts')
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log('All triggers set: SiftTools daily 09:00 + 생각의숲 hourly');
}

/** 레거시 호환용 */
function setupDailyTrigger() {
  setupAllTriggers();
}

/** 텔레그램 연결 테스트 */
function testTelegram() {
  const chatId = PropertiesService.getScriptProperties().getProperty('CHAT_ID_DANIEL');
  sendTelegram_(chatId, '[SiftTools] 텔레그램 봇 연결 테스트 ✅');
}
