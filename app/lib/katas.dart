import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'WhiteBelt.dart';
import 'YellowBelt.dart';
import 'OrangeBelt.dart';

class KataPage extends StatefulWidget {
  const KataPage({super.key});

  @override
  State<KataPage> createState() => _KataPageState();
}

class _KataPageState extends State<KataPage> {
  final TextEditingController _searchController = TextEditingController();

  final Map<String, Map<String, dynamic>> katas = {
    'White Belt': {
      'image': 'lib/assets/WhiteBelt.png',
      'katas': ['Go Ho No Uke', 'Empi Roppo', 'Ten No Kata']
    },
    'Yellow Belt': {
      'image': 'lib/assets/YellowBelt.png',
      'katas': ['Chi No Kata']
    },
    'Orange Belt': {
      'image': 'lib/assets/OrangeBelt.png',
      'katas': ['Pinan Shodan', 'Roppo Ho']
    },
  };

  String searchQuery = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromRGBO(34, 49, 64, 1),
      appBar: AppBar(
        title: Text(
          'Katas',
          style: GoogleFonts.bebasNeue(fontSize: 24, color: Colors.white),
        ),
        backgroundColor: const Color.fromARGB(191, 255, 255, 255),
        elevation: 2,
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: TextField(
              controller: _searchController,
              style: TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search katas...',
                hintStyle: TextStyle(color: Colors.white70),
                prefixIcon: Icon(Icons.search, color: Colors.white),
                filled: true,
                fillColor: Colors.white24,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
              onChanged: (value) {
                setState(() {
                  searchQuery = value.toLowerCase();
                });
              },
            ),
          ),

          // Belt dropdowns
          // Belt dropdowns
Expanded(
  child: katas.entries.any((entry) {
    final kataList = (entry.value['katas'] as List<String>)
        .where((kata) => kata.toLowerCase().contains(searchQuery))
        .isNotEmpty;
    return kataList;
  })
      ? ListView(
          children: katas.entries.map((entry) {
            final belt = entry.key;
            final beltImage = entry.value['image'] as String;
            final kataList = (entry.value['katas'] as List<String>)
                .where((kata) => kata.toLowerCase().contains(searchQuery))
                .toList();

            // If no katas match the search, skip this belt
            if (kataList.isEmpty) return SizedBox.shrink();

            return Theme(
              data: Theme.of(context).copyWith(
                dividerColor: Colors.transparent,
                unselectedWidgetColor: Colors.white,
              ),
              child: ExpansionTile(
                collapsedIconColor: Colors.white,
                iconColor: Colors.white,
                title: Row(
                  children: [
                    Image.asset(
                      beltImage,
                      height: 40,
                      width: 40,
                      fit: BoxFit.fitWidth,
                    ),
                    SizedBox(width: 12),
                    Text(
                      belt,
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
                children: kataList
                    .map(
                      (kata) => ListTile(
                        title: Text(
                          kata,
                          style: TextStyle(color: Colors.white),
                        ),
                        tileColor: const Color.fromARGB(255, 98, 104, 110),
                        onTap: () {
                  if (belt == 'White Belt') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => WhiteBeltPage(kataName: kata),
                      ),
                    );
                  } else if (belt == 'Yellow Belt') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => YellowBeltPage(kataName: kata),
                      ),
                    );
                  } else if (belt == 'Orange Belt') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => OrangeBeltPage(kataName: kata),
                      ),
                    );
                  }
                },
  

                      ),
                    )

                    .toList(),
              ),
            );
          }).toList(),
        )
      : Center(
          child: Text(
            'No matching katas found.',
            style: TextStyle(color: Colors.white70, fontSize: 16),
          ),
        ),
),

        ],
      ),
    );
  }
}
