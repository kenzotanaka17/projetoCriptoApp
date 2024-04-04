import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CoinProps } from "../home";
import styles from './detail.module.css'

interface ResponseData {
    data: CoinProps
}

interface ErrorData {
    error: string
}

type DataProps = ResponseData | ErrorData

export function Detail() {

    const { cripto } = useParams();
    const navigate = useNavigate();

    const [moeda, setMoeda] = useState<CoinProps>();
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        async function getCoin() {
            try {
                fetch(`https://api.coincap.io/v2/assets/${cripto}`)
                .then(response => response.json())
                .then((data : DataProps) => {
                    if("error" in data) {
                        navigate('/')
                        return;
                    }
                    
                    const price = Intl.NumberFormat("en-US", {
                        style: 'currency',
                        currency: 'USD'
                    })
        
                    const priceCompact = Intl.NumberFormat("en-US", {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact'
                    })

                    const resultData = {
                        ...data.data,
                        formatedPrice: price.format(Number(data.data.priceUsd)),
                        formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
                        formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr))
                    }
                    
                    setMoeda(resultData)
                    setLoading(false);

                })
            } catch(err) {
                console.log(err);
                navigate('/')
            }
        }

        getCoin();
    }, [cripto])

    if(loading || !moeda) {
        return(
            <div className={styles.container}>
                <h4 className={styles.center}>Carregando os detalhes da moeda {cripto}</h4>
            </div>
        )
    }
    
    return(
        <div className={styles.container}>
            <h1 className={styles.center}>{moeda?.name}</h1>
            <h1 className={styles.center}>{moeda?.symbol}</h1>

            <section className={styles.content}>
                <img 
                    src={`https://assets.coincap.io/assets/icons/${moeda?.symbol.toLowerCase()}@2x.png`}
                    alt='Logo da moeda'
                    className={styles.logo}
                />
                <h1>{moeda?.name} | {moeda?.symbol}</h1>

                <p><strong> Preço: </strong> {moeda?.formatedPrice}</p>

                <a>
                    <strong>Mercado: </strong>{moeda?.formatedMarket}
                </a>
                <a>
                    <strong>Volume: </strong>{moeda?.formatedVolume}
                </a>
                <a>
                    <strong>Mudança 24h: </strong><span className={Number(moeda?.changePercent24Hr) > 0 ? styles.profit : styles.loss}>{Number(moeda?.changePercent24Hr).toFixed(3)}</span>
                </a>
            </section>
        </div>
    )
}