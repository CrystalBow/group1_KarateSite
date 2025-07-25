import 'package:flutter/material.dart';

class HistoryPage extends StatelessWidget {
  const HistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('History'),
        backgroundColor: Colors.brown[400],
      ),
      body: Stack(
        children: [
          // Brush background
          Positioned.fill(
            child: Opacity(
              opacity: 0.07,
              child: Image.asset(
                'lib/assets/RedBrushPaintTran.png',
                fit: BoxFit.cover,
              ),
            ),
          ),
          // Paragraph container
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: SingleChildScrollView(
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.85),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: const Text(
                  '''
Due to the lack of a written record, not much can be said about the true origins of Karate, but one of the first known styles was Okinawan karate. It originated from Okinawa Island during the mid-1800s when the ruling samurai clan forbade anyone on the island from owning weaponry. To defend themselves, the people of Okinawa started training in martial arts and thus began the tradition of Okinawan karate. Over time, other styles emerged, and now we can tell the tale of Shito-Ryu Karate.

  The story begins with the founder of Shito-Ryu Karte: Kenwa Mabuni. He was born in 1893 in Shuri, Okinawa. He learned from many teachers, but the two who had the biggest influence on him were Ankoh Yasutsune Itosu and Sensei Kanryo Higashionna. Mabuni combined the styles of those two teachers into Shito-Ryu. He began instructing in 1920, and by 1929, he had moved to the mainland and had well established his dojo and style.
''',
                  style: TextStyle(
                    fontSize: 16,
                    height: 1.6,
                    color: Colors.black87,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
