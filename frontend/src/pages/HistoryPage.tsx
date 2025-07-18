import Header2 from "../components/Header2";

const HistoryPage = () =>
{
    return (
        <div>
            <div>
                <Header2 profileImg="/assets/ProfileWhiteBelt.png" beltText="White Belt" />
            </div>

            <div>
                <div className="page-container">
                    <div id="historyCustomCard" className="custom-card">
                        <div className="redBrushBackground">
                            <div id="redGateHeader"className="bebasFont">
                                <h3> History </h3>
                            </div>

                            <div id="whiteBackdrop">
                                <div className="RedColumn left-0">
                                    <div className="RedColumnShade"></div>
                                </div>
                                <div className="RedColumn right-0">
                                    <div className="RedColumnShade"></div>
                                </div>
                                <div id="historyTextBox" className="">
                                    <br/>
                                    <p className=""> Shito-Ryu, like other karate styles, is thought to have originated on Okinawa, one of Japan's largest islands. In 1929, master Kenwa Mabuni established a shito-Ryu school in Osaka, Japan, after settling permanently there. However, schools were required to declare the teaching style they used due to government policies at the time. As a result of the blending techniques, Kenwa Mabuni named it Shito-Ryu after his master's initials. </p>
                                </div>   
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryPage;