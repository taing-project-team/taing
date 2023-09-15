import { useEffect } from 'react';
import styles from './PopupModal.module.scss';

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

// 하루가 지났는지 확인하는 함수
const hasDayPassed = (dateString: string) => {
  const currentTime = new Date().getTime();
  const time = new Date(dateString).getTime();
  return currentTime - time >= ONE_DAY_IN_MILLISECONDS;
};

interface IPopupModalProps {
  closePopup: () => void;
}

const PopupModal = ({ closePopup }: IPopupModalProps) => {
  // 컴포넌트 마운트 시 팝업을 표시할지 말지 결정
  useEffect(() => {
    // localStorage에서 'hideForToday' 항목을 가져옴
    const hideForToday = localStorage.getItem('hideForToday');

    // 만약 'hideForToday' 값이 존재하고, 그 값에 저장된 시간으로부터 하루가 지나지 않았다면
    // 팝업을 닫는다.
    if (hideForToday && !hasDayPassed(hideForToday)) {
      closePopup();
    }
  }, []);

  // "오늘 하루 보지 않기" 버튼 클릭 핸들러
  const handleCloseForToday = () => {
    // 현재 시간을 ISO 형식으로 localStorage에 저장
    localStorage.setItem('hideForToday', new Date().toISOString());
    closePopup();
  };
  return (
    <div className={styles.PopupModal}>
      <img
        className={styles.popupImage}
        src="/src/assets/images/popup_image.png"
        alt="popupImage"
      />
      <div className={styles.buttonBox}>
        <button onClick={handleCloseForToday} type="button">
          오늘 하루 보지 않기
        </button>
        <button onClick={closePopup} type="button">
          닫기
        </button>
      </div>
    </div>
  );
};

export default PopupModal;