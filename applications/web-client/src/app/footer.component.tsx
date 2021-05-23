import React, { useEffect } from 'react';
import './footer.component.css';
import background1 from 'url:../../assets/background_1.png';
import createPersistedState from 'use-persisted-state';
import i18n from 'es2015-i18n-tag';

const useBackgroundState = createPersistedState('background')
const useThemeState = createPersistedState('theme')

const backgrounds = [{ color: '#ddd' }, { image: background1, color: '#cd4063' }];
const themes = ['clean', 'playful'];

const Footer = () => <div className="footer">
  <BackgroundSelector />
  <ThemeSelector />
  <div style={{ flex: 1 }}/>
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
      document.body.style.setProperty('--color-primary', background.color);
      //document.body.style.setProperty('--button-default', 'var(--page-background)');
      document.body.style.setProperty('--footer-color', 'rgba(255, 255, 255, 0.78)');
    }else {
      document.body.style.removeProperty('--color-primary');
      //document.body.style.removeProperty('--button-default');
      document.body.style.removeProperty('--footer-color');
    }
  }, [backgroundIndex]);

  return <div className="background-selector">
    {backgrounds.map((background, i) => <button key={i} className="background-selector__background"
                                                style={{ background: convertBackground(background) }}
                                                onClick={() => setBackgroundIndex(i)} />)}
  </div>;
};

const ThemeSelector = () => {
  const [theme, setTheme] = useThemeState(themes[0]);

  useEffect(() => {
    document.body.className = `body theme--${theme}`;
  }, [theme]);

  return <select title={i18n`Theme`} className="select theme-selector" onChange={e => setTheme(e.target.value)} value={theme}>
    {themes.map((theme) => <option key={theme} value={theme}>{theme}</option>)}
  </select>
}

function convertBackground(background: { color: string } | { image: string }) {
  if ('image' in background) {
    return `transparent url(${background.image}) no-repeat scroll center/cover`;
  }
  return `${background.color} no-repeat scroll center/cover`;
}

export default Footer;
