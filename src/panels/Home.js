import { useRef } from 'react'
import { Panel, PanelHeader, Header, Button, Group, Div } from '@vkontakte/vkui';
import vkBridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import './StorySticker.css';

export const Home = ({ id }) => {
  const storyCardContainer = useRef();
  const containerRef = useRef();
  const ref = storyCardContainer
  const container = containerRef.current
   const gotoStoryBox = async () => {
      let domEl = ref.current

      if (!domEl) {
        return Promise.reject({ error: 'cannot get domEl' })
      }

      if (container) {
        container.innerHTML = ''
        const cloneEl = domEl.cloneNode(1)
        container.appendChild(cloneEl)
        container.width = cloneEl.clientWidth
        container.height = cloneEl.clientHeight
        domEl = cloneEl
      }
      const contain = domEl.querySelectorAll('svg') || []
      contain.forEach((svgIcon) => {
        const svgUse = svgIcon.childNodes[0]

        if (svgUse.tagName === 'use') {
          const svgSelector = svgUse.getAttributeNS(
            'http://www.w3.org/1999/xlink',
            'href'
          )
          const svgData = document.querySelector(svgSelector)
          const currentColor = 'currentColor'

          svgIcon.innerHTML = svgData.innerHTML.replace(
            /currentColor/g,
            currentColor
          )
        }

        svgIcon.setAttribute('width', svgIcon.clientWidth.toString())
        svgIcon.setAttribute('height', svgIcon.clientHeight.toString())
      })

      return html2canvas(domEl, {
        backgroundColor: 'transparent',
        scrollX: 0,
        scrollY: -window.scrollY,
        useCORS: false,
        scale: 1,
        width: domEl.clientWidth,
        height: domEl.clientHeight,
      })
        .catch((error) => {
          console.error('html2canvas error', error)
          // eslint-disable-next-line
          throw {
            error_data: {
              error_code: 418,
              error_description: 'html2canvas error',
            },
          }
        })
        .then((resCanvas) => {
          const story_data = {
            background_type: 'video',
            url: 'https://psv4.userapi.com/c909618/u20864822/docs/d36/d6e06fa241e9/stories-creative.mp4',
            locked: false,
            stickers: [{
            sticker_type: 'renderable',
            sticker: {
            content_type: 'image',       
            clickable_zones: [
        {
          action_type: 'link',
          action: {
            tooltip_text_key: 'tooltip_open_page',
            link: 'https://vk.com/app51984547'
          },
          clickable_area: [
            { x: 0, y: 0 },
            { x: resCanvas.width, y: 0 },
            { x: resCanvas.width, y: resCanvas.height },
            { x: 0, y: resCanvas.height },
          ]
        }
      ],
        blob: resCanvas.toDataURL('png'),
        transform: {
          gravity: 'center',
          relation_width: 0.8,
        },
      }
    }],         
          }
          vkBridge
            .send('VKWebAppShowStoryBox', story_data)
            .then((response) => {
              if (response) {
 
                console.log('VKWebAppShowStoryBox response', response)
              }
            })
            .catch((error) => {
           
              console.error('VKWebAppShowStoryBox reject', error)
            })
        })
   }
  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
  
      <Group header={<Header mode="secondary">StoryBox Example</Header>}>
        <Div>
              <div
              ref={containerRef}
              className='bg-box'
            ></div>
<div ref={storyCardContainer} className="content-background">
      <div className="content-wrap">
        <div className="content-body">
          <div className="content-info">
            <div className="content-title">Кастомный стикер блок</div>
            <div className="content-separator" />
            <div className="content-title">Текст</div>
          </div>
        </div>
      </div> 
  </div>


          <Button stretched size="l" mode="secondary" onClick={() => {
            gotoStoryBox()
          }}>
            В редактор историй
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
