import React, { useEffect } from 'react';
import './footer.component.css';
import background1 from 'url:../../assets/background_1.png';
import createPersistedState from 'use-persisted-state';

const useBackgroundState = createPersistedState('background')

const backgrounds = [{ color: '#ddd' }, { image: background1 }];

const Footer = () => <div className="footer">
  <BackgroundSelector />
  <Links/>
</div>;

const Links = () => <div className="links">
  <a target="_blank" href="https://github.com/maxjoehnk/remote-party-games">Github</a>
</div>

const BackgroundSelector = () => {
  const [backgroundIndex, setBackgroundIndex] = useBackgroundState(0);

  useEffect(() => {
    const background = backgrounds[backgroundIndex];
    const isImage = 'image' in background;
    document.body.style.background = convertBackground(background);
    if (isImage) {
      document.body.style.setProperty('--button-default', 'var(--page-background)');
      document.body.style.setProperty('--footer-color', 'var(--page-background)');
    }else {
      document.body.style.removeProperty('--button-default');
      document.body.style.removeProperty('--footer-color');
    }
  }, [backgroundIndex]);

  return <div className="background-selector">
    {backgrounds.map((background, i) => <button key={i} className="background-selector__background"
                                                style={{ background: convertBackground(background) }}
                                                onClick={() => setBackgroundIndex(i)} />)}
  </div>;
};

function convertBackground(background: { color: string } | { image: string }) {
  if ('color' in background) {
    return `${background.color} no-repeat scroll center/cover`;
  }
  return `transparent url(${background.image}) no-repeat scroll center/cover`;
}

export default Footer;
