import React from 'react'
import useSWR, { mutate } from 'swr'
import { NextSeo } from 'next-seo'
import styled from '@emotion/styled'
import Hr from 'components/Hr'
import Form from 'components/Form'
import Button from 'components/Button'
import Comments from 'components/Comments'
import Pagination from 'components/Pagination'
import Screen from 'components/Screen'
import Page from 'components/layouts/Page'
import { useGameState } from 'hooks/game'
import { COLORS } from 'styles'
import ogImage from 'assets/og-sign.png'


const Header = styled.h1({
    margin: 0,
    padding: '26px',
    background: '#042A78',
    color: 'white',
    fontSize: '24px',
    lineHeight: '33px',
    textAlign: 'center',
})


const RatioBar = ({ data }) => {
    const total = data.reduce((a, b) => a.n + b.n)

    return (
        <div css={{
            height: '20px',
            display: 'flex',
        }}>
            {data.map((number, i) => (
                <div
                    key={number.label}
                    style={{
                        width: `${number.n / total * 100}%`,
                        height: '100%',
                        background: number.color,
                    }}
                />
            ))}
        </div>
    )
}


const Label = ({ item }) => (
    <li css={{ listStyle: 'none', color: item.color }}>
        <div css={{ fontWeight: 'bold' }}>
            {item.label}
        </div>
        <div css={{ fontWeight: 300 }}>
            ({item.n.toLocaleString()})
        </div>
    </li>
)


const Labels = ({ data }) => (
    <div>
        <ul css={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
        }}>
            {data.map(item => <Label item={item} />)}
        </ul>
    </div>
)


const LinkToGame = styled.a({
    margin: '8px',
    textAlign: 'right',
    fontSize: '15px',
    textDecoration: 'none',
    color: 'inherit',
})


const Floating = styled.div({
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    width: '90px',
    height: '90px',
    borderRadius: '45px',
    background: '#0f347c',
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    a: {
        color: 'inherit',
        textDecoration: 'none',
    },
})

const Result = () => {
    const [formOpened, setFormOpened] = React.useState(false)
    const [current, setCurrent] = React.useState(1)

    const {state} = useGameState()

    const {data: comments } = useSWR(`/api/signs?page=${current}&pageSize=${5}`)
    const {data: votes_} = useSWR('/api/votes')

    const votes = votes_ && [{
        label: '괜찮아요',
        color: COLORS.pos,
        n: votes_['1'],
    }, {
        label: '바꿔야해요',
        color: COLORS.neg,
        n: votes_['2'],
    }]

    return (
        <Screen>
            <NextSeo
                title="우리의 참여로 강간죄를 바꿀 수 있습니다."
                description="여러분이 남겨주신 의견을 모아서 입법자들에게 가져갑니다."
                canonical="https://wonderful-law.korea.wtf/sign"
                openGraph={{
                    type: 'website',
                    url: 'https://wonderful-law.korea.wtf/sign',
                    images: [{
                        url: `https://wonderful-law.korea.wtf${ogImage}`,
                        alt: '우리의 참여로 강간죄를 바꿀 수 있습니다. 서명하러가기'
                    }]
                }}
            />
            <Header>
                지금 법 이대로
                괜찮은가요?
            </Header>
            <Page css={{
                section: {
                    padding: '20px 0',
                },
                wordBreak: 'keep-all',
            }}>
                <section>
                    {votes &&
                    <>
                        <Labels data={votes} />
                        <RatioBar data={votes} />
                        {!state.voted && <LinkToGame href="/">판사 체험하고 투표하기</LinkToGame>}
                    </>
                    }
                </section>

                {/*<section>*/}
                {/*    <Share>*/}
                {/*        <Button>공유하기</Button>*/}
                {/*        <div style={{textAlign: 'center'}}>*/}
                {/*            <h3>공유하기</h3>*/}
                {/*            <div>*/}
                {/*                <input value="https://assdaadsads주소주소" />*/}
                {/*            </div>*/}
                {/*            <div>*/}
                {/*                <button>Facebook</button>*/}
                {/*                <button>Twitter</button>*/}
                {/*                <button>Kakao</button>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </Share>*/}
                {/*</section>*/}

                <section>
                    <Hr />
                    <h3 style={{ fontWeight: 'normal' }}>
                        우리의 참여로 <strong>강간죄</strong>를
                        <br />
                        바꿀 수 있습니다
                    </h3>
                    <Hr />
                    <p style={{ lineHeight: 1.45 }}>
                        <strong>
                            여러분이 남겨주신 의견을 모아서
                            <br />
                            입법자들에게 가져갑니다.
                        </strong>
                    </p>
                    <div>
                        {formOpened ?
                            <Form onSubmitted={() => mutate('/api/signs')} /> :
                            <Button full onClick={() => setFormOpened(true)}>서명하기</Button>
                        }
                    </div>
                </section>

                <section>
                    {comments &&
                    <>
                        <p>지금까지 <strong>{comments.count}명</strong>이 개정 서명에 참여하였습니다</p>
                        <Comments comments={comments.items} />
                        <Pagination current={current} setCurrent={setCurrent} pageSize={5} total={comments.count} />
                    </>
                    }
                </section>

                <Floating>
                    <a target="_blank" href="https://change297.tistory.com/">
                        강간죄 개정연대 블로그
                    </a>
                </Floating>
            </Page>
        </Screen>
    )
}


export default Result
