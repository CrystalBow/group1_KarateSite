import Header2 from "../components/Header2";

const HistoryPage = () =>
{
    return (
        <div>
            <div>
                <Header2 />
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
                                    <p> 
                                        &emsp; Due to the lack of a written record, not much can be said about the true origins of Karate, 
                                        but one of the first known styles was Okinawan karate. It originated from Okinawa Island during the 
                                        mid-1800s when the ruling samurai clan forbade anyone on the island from owning weaponry. 
                                        To defend themselves, the people of Okinawa started training in martial arts and thus began 
                                        the tradition of Okinawan karate. Over time, other styles emerged, and now we can tell the tale 
                                        of Shito-Ryu Karate.
                                    </p>
                                    <p>
                                        &emsp; The story begins with the founder of Shito-Ryu Karte: Kenwa Mabuni. He was born in 1893 in Shuri, 
                                        Okinawa. He learned from many teachers, but the two who had the biggest influence on him were 
                                        Ankoh Yasutsune Itosu and Sensei Kanryo Higashionna. Mabuni combined the styles of those two teachers
                                        into Shito-Ryu. He began instructing in 1920, and by 1929, he had moved to the mainland and had well 
                                        established his dojo and style.
                                    </p>
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