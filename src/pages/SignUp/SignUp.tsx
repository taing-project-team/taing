import { useEffect, useState } from 'react';
import { useSignUp } from '@/hooks/auth/useSignUp';
import { useCreateAuthUser } from '@/hooks/firestore/useCreateAuthUser';
import { useCustomNavigate } from '@/hooks/useCustomNavigate';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  emailState,
  emailErrorState,
  passwordState,
  passwordErrorState,
  confirmPasswordState,
  confirmPasswordErrorState,
} from '@/state/signUpState';

import Checkbox from '@components/common/Checkbox/Checkbox';
import Button from '@components/common/Button/Button';
import styles from './SignUp.module.scss';
import EmailInput from '@/components/EmailInput/EmailInput';
import PasswordInput from '@/components/PasswordInput/PasswordInput';
import ConfirmPasswordInput from '@/components/ConfirmPasswordInput/ConfirmPasswordInput';

type CheckedItemsType = { [key: string]: boolean };

const SignUp = () => {
  const email = useRecoilValue(emailState);
  const password = useRecoilValue(passwordState);
  const confirmPassword = useRecoilValue(confirmPasswordState);
  const emailError = useRecoilValue(emailErrorState);
  const passwordError = useRecoilValue(passwordErrorState);
  const [confirmPasswordError, setConfirmPasswordError] = useRecoilState(
    confirmPasswordErrorState,
  );

  const checkboxes = [
    { id: 'agree1', label: '만 14세 이상입니다.' },
    {
      id: 'agree2',
      label: '[필수] 서비스 이용약관 동의',
    },
    {
      id: 'agree3',
      label: '[필수] 개인전보 수집 및 서비스 활용 동의',
    },
    {
      id: 'agree4',
      label: '[필수] 채널 홈페이지 개인정보 제 3자 제공동의',
    },
    {
      id: 'agree5',
      label: '[선택] 개인정보 제 3자 제공동의',
    },
    {
      id: 'agree6',
      label: '[선택] 개인정보 수집 및 서비스 활용 동의',
    },
    {
      id: 'subAgree1',
      label: '[선택] 마케팅 정보 SMS 수신동의',
      additionalClass: styles.subAgree,
    },
    {
      id: 'subAgree2',
      label: '[선택] 마케팅 정보 이메일 수신동의',
      additionalClass: styles.subAgree,
    },
  ];

  // 체크박스 초기 상태 설정
  const initialChecks = checkboxes.reduce((acc: CheckedItemsType, chk) => {
    acc[chk.id] = false;
    return acc;
  }, {});

  const [checkedItems, setCheckedItems] =
    useState<CheckedItemsType>(initialChecks);

  // '가입하기' 버튼의 disabled 속성을 결정하는 함수
  const isSubmitDisabled = () => {
    const areRequiredChecks = checkboxes
      .filter(
        chk =>
          chk.label.startsWith('[필수]') || chk.label === '만 14세 이상입니다.',
      )
      .every(chk => checkedItems[chk.id]);

    return (
      !areRequiredChecks ||
      Boolean(emailError) ||
      Boolean(passwordError) ||
      Boolean(confirmPasswordError)
    );
  };

  const { navigateTo } = useCustomNavigate();

  const { signUp } = useSignUp(true);
  const { createAuthUser } = useCreateAuthUser();

  useEffect(() => {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordError('일치하지 않습니다. 다시 입력해주세요.');
      } else {
        setConfirmPasswordError(null);
      }
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log('회원가입 실패: 비밀번호 불일치');
      return;
    }

    const userCredential = await signUp(email, password);
    if (userCredential && userCredential.user && userCredential.user.email) {
      const userAuth = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
      await createAuthUser(userAuth);
      navigateTo('/login');
    }
  };

  // '모두 동의합니다' 체크박스를 토글할 때의 핸들러
  const handleAllCheckToggle = () => {
    const shouldCheckAll = !checkboxes.every(chk => checkedItems[chk.id]);
    const newCheckedItems: CheckedItemsType = {};

    checkboxes.forEach(chk => {
      newCheckedItems[chk.id] = shouldCheckAll;
    });

    setCheckedItems(newCheckedItems);
  };

  // 개별 체크박스를 토글할 때의 핸들러
  const handleCheckboxChange = (id: string) => {
    const newCheckedItems: CheckedItemsType = {
      ...checkedItems,
      [id]: !checkedItems[id],
    };
    // [선택] 개인정보 수집 및 서비스 활용 동의가 체크될 때
    if (id === 'agree6' && !checkedItems[id]) {
      newCheckedItems['subAgree1'] = true;
      newCheckedItems['subAgree2'] = true;
    } else if (id === 'agree6' && checkedItems[id]) {
      // 해제될 때
      newCheckedItems['subAgree1'] = false;
      newCheckedItems['subAgree2'] = false;
    }

    // [선택] 마케팅 정보 SMS 수신동의나 [선택] 마케팅 정보 이메일 수신동의 중 하나라도 해제되면
    if ((id === 'subAgree1' || id === 'subAgree2') && checkedItems[id]) {
      newCheckedItems['agree6'] = false;
    } else if (
      (id === 'subAgree1' || id === 'subAgree2') &&
      !checkedItems[id]
    ) {
      // 둘 다 체크되어있는 상태에서 하나가 체크될 때
      if (newCheckedItems['subAgree1'] && newCheckedItems['subAgree2']) {
        newCheckedItems['agree6'] = true;
      }
    }
    setCheckedItems(newCheckedItems);
  };

  // 모든 체크박스가 체크되었는지 확인
  const isAllChecked = checkboxes.every(chk => checkedItems[chk.id]);

  return (
    <main className={styles.SignUp}>
      <div className={styles.titleBox}>
        <h1 className={styles.title}>타잉 회원가입</h1>
        <h4 className={styles.info}>이메일로 간편하게 티빙을 시작하세요!</h4>
      </div>
      <form className={styles.formBox} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <EmailInput />
          <PasswordInput />
          <ConfirmPasswordInput />
        </div>
        <div className={styles.agreeWrapper}>
          <ul className={styles.allAgree}>
            <Checkbox
              id={'allAgree'}
              label={'모두 동의합니다.'}
              checked={isAllChecked}
              onChange={handleAllCheckToggle}
            />
          </ul>
          <ul className={styles.agreeBox}>
            {checkboxes.map(chk => (
              <Checkbox
                key={chk.id}
                id={chk.id}
                label={chk.label}
                additionalClass={chk.additionalClass}
                checked={checkedItems[chk.id] || false}
                onChange={() => handleCheckboxChange(chk.id)}
              />
            ))}
          </ul>
        </div>
        <Button
          type={'submit'}
          state={'login'}
          title={'가입하기'}
          disabled={isSubmitDisabled()}
        />
      </form>
    </main>
  );
};
export default SignUp;
