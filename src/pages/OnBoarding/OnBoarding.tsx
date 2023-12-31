import styles from './OnBoarding.module.scss';
import TaingButton from '@components/TaingButton/TaingButton';
import useFilterData, { filterDataByPage } from '@/hooks/useFilterData';
import { IImageData } from 'src/type';
import { useEffect, useState } from 'react';
import ScrollSlider from '@components/ScrollSlider/ScrollSlider';
import AutoSlider from '@components/AutoSlider/AutoSlider';
import Intro from '@components/Intro/Intro';
import Loader from '@/components/Loader/Loader';
import useRedirect from '@/hooks/useRedirect';
import MetaTag from '@/components/MetaTag/MetaTag';

const OnBoarding = () => {
  const { filterData, isLoading } = useFilterData('onBoarding');
  const [onlySwipeSmall, setOnlySwipeSmall] = useState<IImageData[]>([]);
  const [onlySwipeLarge, setOnlySwipeLarge] = useState<IImageData[]>([]);
  const [FindSwipe, setFindSwipe] = useState<IImageData[]>([]);
  const { userLoggedInCheck, user } = useRedirect();
  const metaData = {
    title: '온보딩',
    description: '타잉의 온보딩 페이지 입니다',
  };
  useEffect(() => {
    userLoggedInCheck();
  }, [user]);
  useEffect(() => {
    setOnlySwipeSmall(filterDataByPage(filterData, 'onBoarding', 'small'));
    setOnlySwipeLarge(filterDataByPage(filterData, 'onBoarding', 'large'));
    setFindSwipe(filterDataByPage(filterData, 'onBoarding', 'medium'));
  }, [filterData]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <MetaTag
        title={metaData.title}
        description={metaData.description}
        href={filterData[0]?.onBoarding?.background}
      />
      <Intro background={filterData[0]?.onBoarding?.background} />
      <main>
        <ScrollSlider
          onlySwipeSmall={onlySwipeSmall}
          onlySwipeLarge={onlySwipeLarge}
        />
        <AutoSlider findSwipe={FindSwipe} />
        <div className={styles.message}>
          <div className={styles.message_logo} />
          <p className={styles.message_title}>지금 시작해보세요</p>
          <TaingButton />
        </div>
      </main>
    </>
  );
};

export default OnBoarding;
