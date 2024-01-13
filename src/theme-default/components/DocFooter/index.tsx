import Styles from './index.module.scss';
import { usePrevNextPage } from '../../logic/usePrevNextPage';

export function DocFooter() {
  const { prevPage, nextPage } = usePrevNextPage();
  return (
    <footer mt="8">
      <div flex="~" gap="2" divider-top="~" pt="6">
        <div flex="~ col" className={Styles.prev}>
          {prevPage && (
            <a href={prevPage.link} className={Styles.pagerLink}>
              <span className={Styles.desc}>上一页</span>
              <span className={Styles.title}>{prevPage.text}</span>
            </a>
          )}
        </div>
        <div flex="~ col" className={Styles.next}>
          {nextPage && (
            <a href={nextPage.link} className={`${Styles.pagerLink} ${Styles.next}`}>
              <span className={Styles.desc}>下一页</span>
              <span className={Styles.title}>{nextPage.text}</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
