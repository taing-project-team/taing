import styles from './FindPassword.module.scss';
import Input from '@components/common/Input/Input';
import Button from '@components/common/Button/Button';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useResetPassword } from '@/hooks/auth';
import useRedirect from '@/hooks/useRedirect';
import MetaTag from '@/components/MetaTag/MetaTag';

const FindPassword = () => {
  const { isLoading, error, resetPassword } = useResetPassword();
  const [email, setEmail] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [hintMessage, setHintMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { userLoggedInCheck, user } = useRedirect();
  const metaData = {
    title: '비밀번호 찾기',
    description:
      '이메일을 입력하면 비밀번호 초기화 메일을 전달 하는 페이지 입니다',
  };
  useEffect(() => {
    userLoggedInCheck();
  }, [user]);

  const onFindPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPassword(email).then(() => setHintMessage('이메일이 전송되었습니다'));
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setErrorMessage('');
    setHintMessage('');
    setIsSubmitEnabled(newEmail.length > 0);
  };
  useEffect(() => {
    if (error?.message) {
      setErrorMessage('이메일이 존재하지 않습니다');
    }
  }, [error?.message]);

  return (
    <>
      <MetaTag title={metaData.title} description={metaData.description} />
      <main className={styles.FindPassword}>
        <h1 className={styles.title}>비밀번호 찾기</h1>
        <form className={styles.findForm} onSubmit={onFindPassword}>
          <p className={styles.findInfo}>
            이메일 확인 후 등록된 이메일 주소로 비밀번호 재설정을 위한
            인증메일이 발송됩니다. 이메일을 확인하여 12시간 이내에 비밀번호
            재설정을 완료해주세요.
          </p>
          <Input
            type={'email'}
            placeholderText={'이메일'}
            value={email}
            onChange={onInputChange}
            hintMessage={hintMessage && hintMessage}
            errorMessage={errorMessage && errorMessage}
          />
          <Button
            type={'submit'}
            title={isLoading ? 'loading..' : '확인'}
            state={'active'}
            disabled={!isSubmitEnabled}
          />
        </form>
      </main>
    </>
  );
};

export default FindPassword;
