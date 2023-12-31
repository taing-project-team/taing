import { useLocation } from 'react-router';
import styles from './Header.module.scss';
import { useEffect, useState } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import ProfileModal from '@components/ProfileModal/ProfileModal';
import SearchModal from '../SearchModal/SearchModal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import DummyLink from '../common/DummyLink/DummyLink';
import { IClassNames, IProfile } from '@/type';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { profileState } from '@/state/profileState';
import { useAuthState } from '@/hooks/auth';
const Header = () => {
  const { user } = useAuthState();
  const { lockScroll, openScroll } = useBodyScrollLock();
  const profileList = useRecoilValue(profileState);
  const [headerProfileImage, setHeaderProfileImage] = useState('profileFirst');
  const [headerProfileName, setHeaderProfileName] = useState('프로필1');
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const isOnboarding = ['/onboarding'].includes(pathname);
  const isAuthPage = [
    '/profile',
    '/profile-edit',
    '/login-selection',
    '/find-id',
    '/find-password',
    '/login',
    '/signup',
  ].includes(pathname);
  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(0,0,0,0)', 'rgba(0,0,0,1)'],
  );
  const [openSearchModal, setOpenSerchModal] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const headerClassNames = [
    styles.header,
    isOnboarding && styles.simple,
    isAuthPage && styles.auth,
  ]
    .filter(Boolean)
    .join(' ');

  const onOpenSearchModal = () => {
    lockScroll();
    setOpenSerchModal(true);
  };
  const onCloseSearchModal = () => {
    openScroll();
    setOpenSerchModal(false);
  };
  const toggleProfile = () => {
    setOpenProfile(prevOpenProfile => !prevOpenProfile);
  };

  const profileClassNames: IClassNames = {
    profileFirst: styles.profileFirst,
    profileSecond: styles.profileSecond,
    profileThird: styles.profileThird,
    profileFourth: styles.profileFourth,
  };

  useEffect(() => {
    const activeProfile = profileList.find(
      (profile: IProfile) => profile.isActive,
    );
    if (activeProfile) {
      setHeaderProfileImage(activeProfile.image);
      setHeaderProfileName(activeProfile.name);
    }
  }, [profileList]);

  return (
    <motion.div style={{ backgroundColor }} className={headerClassNames}>
      <h1>
        <span className="a11y">타잉 홈</span>
        <Link className={styles.logo} to="/" aria-label="타잉 로고" />
      </h1>
      <ul className={styles.nav}>
        <li>
          <DummyLink className={styles.live}>
            <span className={styles.liveIcon}></span>
            <span>실시간</span>
          </DummyLink>
        </li>
        <li>
          <DummyLink className={styles.tv}>TV 프로그램</DummyLink>
        </li>
        <li>
          <DummyLink className={styles.movie}>영화</DummyLink>
        </li>
        <li>
          <DummyLink className={styles.paramount}>
            <span className="a11y">파라마운트</span>
          </DummyLink>
        </li>
      </ul>
      {user ? (
        <ul className={styles.aside}>
          <li>
            {openSearchModal ? (
              <button
                onClick={onCloseSearchModal}
                className={styles.close}
                aria-label="검색창 열기"
              ></button>
            ) : (
              <button
                onClick={onOpenSearchModal}
                className={styles.search}
                aria-label="검색창 닫기"
              ></button>
            )}
          </li>

          <li>
            <button
              onMouseEnter={toggleProfile}
              onMouseLeave={toggleProfile}
              className={`${styles.profile} ${profileClassNames[headerProfileImage]}`}
              aria-label="프로필 아이콘"
            ></button>
          </li>
        </ul>
      ) : null}
      {openSearchModal && <SearchModal onClose={onCloseSearchModal} />}
      {openProfile && (
        <ProfileModal
          show={openProfile}
          onMouseEnter={toggleProfile}
          onMouseLeave={toggleProfile}
          name={headerProfileName}
          image={headerProfileImage}
        />
      )}
    </motion.div>
  );
};

export default Header;
