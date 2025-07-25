import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:ui';
import 'package:visibility_detector/visibility_detector.dart';
import 'WhiteBelt.dart';
import 'YellowBelt.dart';
import 'OrangeBelt.dart';
import 'katas.dart';
import 'usersession.dart';
import 'historyPage.dart';
import 'package:lottie/lottie.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class CurriculumPage extends StatefulWidget {
  const CurriculumPage({super.key});

  @override
  State<CurriculumPage> createState() => _CurriculumPageState();
}

class _CurriculumPageState extends State<CurriculumPage> {

  bool _showProfileInfo = false;

  final Map<String, double> visibilityMap = {
    'box1': 1.0,
    'box2': 1.0,
    'box3': 1.0,
  };

  String? selectedBoxKey;

  void updateVisibility(String key, double visibleFraction) {
    setState(() {
      visibilityMap[key] = visibleFraction;
    });
  }

  void _logout() {
  setState(() {
    UserSession.clear(); // Add this method to reset session
  });
    Navigator.of(context).pushNamedAndRemoveUntil('/', (route) => false);
  }

  void onBoxTap(String key) {
    setState(() {
      selectedBoxKey = key;
    });
  }

    void _showEditProfileDialog() {
    final TextEditingController nameController = TextEditingController(text: UserSession.name);
    final TextEditingController emailController = TextEditingController(text: UserSession.email);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit Profile'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: InputDecoration(labelText: 'Name'),
            ),
            TextField(
              controller: emailController,
              decoration: InputDecoration(labelText: 'Email'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              await _updateUserInfo(nameController.text, emailController.text);
              Navigator.pop(context);
            },
            child: Text('Save'),
          ),
        ],
      ),
    );
  }
  
  void _showEditBeltDialog() {
    String? selectedBelt;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Select Belt Level'),
        content: DropdownButtonFormField<String>(
          value: null,
          hint: Text('Choose a belt'),
          onChanged: (value) {
            selectedBelt = value;
          },
          items: ['White', 'Yellow', 'Orange'].map((belt) {
            return DropdownMenuItem(
              value: belt,
              child: Text(belt),
            );
          }).toList(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (selectedBelt != null) {
                await _updateUserBelt(selectedBelt!);
                Navigator.pop(context);
              }
            },
            child: Text('Save'),
          ),
        ],
      ),
    );
  }

  void _confirmDeleteAccount() {
  showDialog(
    context: context,
    builder: (context) => AlertDialog(
      title: Text('Delete Account?'),
      content: Text('Are you sure you want to delete your account? This action is irreversible.'),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            Navigator.pop(context);
            _deleteAccount();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red,
          ),
          child: Text('Delete'),
        ),
      ],
    ),
  );
}

  Future<void> _deleteAccount() async {
  final url = Uri.parse('http://karatetrainer.xyz:5000/api/deleteUser');
  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'user': UserSession.email,
      'jwtToken': UserSession.accessToken,
    }),
  );

  final data = jsonDecode(response.body);
  if (response.statusCode == 200 && data['error'] == '') {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Account deleted.')),
    );
    UserSession.clear();
    Navigator.of(context).pushNamedAndRemoveUntil('/', (route) => false);
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Delete failed: ${data['error']}')),
    );
  }
}



    Future<void> _updateUserInfo(String name, String email) async {
    final url = Uri.parse('http://karatetrainer.xyz:5000/api/editUserInfo');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'user': UserSession.email,  // use current email as user ID
        'name': name,
        'email': email,
        'jwtToken': UserSession.accessToken,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200 && data['error'] == '') {
      setState(() {
        UserSession.name = name;
        UserSession.email = email;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Profile updated!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update: ${data['error']}')),
      );
    }
  }

  Future<void> _updateUserBelt(String belt) async {
      final url = Uri.parse('http://karatetrainer.xyz:5000/api/editUserInfo');

      int progressW = 0;
      int progressY = 0;
      int progressO = 0;

      // Simulate progress based on belt
      switch (belt) {
        case 'White':
          progressW = 1;
          break;
        case 'Yellow':
          progressW = 6; // white complete
          progressY = 1;
          break;
        case 'Orange':
          progressW = 6;
          progressY = 3;
          progressO = 1;
          break;
      }

      int rank = 0;
        switch (belt) {
          case 'White':
            rank = 0;
            break;
          case 'Yellow':
            rank = 1;
            break;
          case 'Orange':
            rank = 2;
            break;
      }


      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'id': UserSession.id, // assuming this exists
          'progressW': progressW,
          'progressY': progressY,
          'progressO': progressO,
          'jwtToken': UserSession.accessToken,
          'rank': rank, // assuming rank is the belt level
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['error'] == '') {
        setState(() {
          UserSession.progressW = data['progressW'].toString();
          UserSession.progressY = data['progressY'].toString();
          UserSession.progressO = data['progressO'].toString();
          UserSession.accessToken = data['jwtToken'];
          UserSession.belt = data['rank'] ?? 'White Belt'; // Update belt level
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Belt level updated!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Update failed: ${data['error']}')),
        );
      }
    }

    double _getNormalizedProgress(String progressString) {
      try {
        final progress = int.parse(progressString);
        return (progress / 100).clamp(0.0, 1.0); // ensures between 0 and 1
      } catch (_) {
        return 0.0;
      }
    }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
    title: Text('Welcome, ${UserSession.name}'),
    titleTextStyle: TextStyle(
      fontFamily: GoogleFonts.bebasNeue().fontFamily,
      fontSize: 24,
      color: const Color.fromARGB(255, 0, 0, 0),
    ),
    leading: Builder(
        builder: (context) => IconButton(
          icon: Image.asset('lib/assets/logo.png', width: 60, height: 60),
          onPressed: () {
            Scaffold.of(context).openDrawer();
          },
        ),
      ),
    actions: [
      IconButton(
        icon: Image.asset('lib/assets/shrine.png', width: 40, height: 40),
        tooltip: 'Katas',
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => KataPage()),
          );
        },
      ),
    ],
    backgroundColor: const Color.fromRGBO(247, 222, 196, 1),
    ),
    
    drawer: Drawer(
      width: 340,
      backgroundColor: const Color.fromRGBO(34, 49, 64, 1),
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          Container(
            height: 150,
            alignment: Alignment.centerLeft,
            padding: EdgeInsets.symmetric(horizontal: 30.0, vertical: 30.0),
            color: const Color.fromARGB(255, 98, 104, 110),
            child: Text(
              'Menu',
              style: GoogleFonts.bebasNeue(fontSize: 28, color: const Color.fromARGB(255, 255, 255, 255)),
            ),
          ),

          // Toggleable Profile Section
          StatefulBuilder(
            builder: (context, setDrawerState) {
              // Profile section that can be expanded/collapsed
              return Column(
                children: [
                  ListTile(
                    leading: Icon(Icons.person),
                    title: Text(
                      'Profile', 
                      style: GoogleFonts.bebasNeue(
                        fontSize: 25, 
                        color: Colors.white
                      ),  
                  ),
                  trailing: Icon(_showProfileInfo ? Icons.expand_less : Icons.expand_more),
                    onTap: () {
                      setDrawerState(() {
                        _showProfileInfo = !_showProfileInfo;
                      });
                    },
                  ),
                  if (_showProfileInfo)
                    Padding(
                      padding: const EdgeInsets.only(left: 72.0, right: 16.0, bottom: 8),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(UserSession.name, style: GoogleFonts.bebasNeue(fontSize: 20, color: Colors.white)),
                                  Text(UserSession.email, style: GoogleFonts.bebasNeue(fontSize: 20, color: Colors.white)),
                                ],
                              ),
                              IconButton(
                                icon: Icon(Icons.edit, color: Colors.white),
                                onPressed: _showEditProfileDialog,
                  
                              ),
                            ],
                          ),
                          Divider(),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Belt Level: White${UserSession.belt}',
                                style: GoogleFonts.bebasNeue(
                                  fontSize: 20,
                                  color: Colors.white,
                                ),
                              ),
                              IconButton(
                                onPressed: _showEditBeltDialog, 
                                icon: Icon(Icons.edit, color: Colors.white)),
                            ],
                            
                          ),
                          Divider(),
                          Row(
                            children: [
                              Text(
                                  'Streak: ${UserSession.streak} days',
                                  style: GoogleFonts.bebasNeue(
                                    fontSize: 20,
                                    color: Colors.white,
                                  ),
                                ),
                              Lottie.asset(
                                'lib/assets/animations/fireStreak.json',
                                width: 30,
                                height: 30,
                                fit: BoxFit.contain,
                                repeat: true,
                                animate: true,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                ], 
              );
            },
          ),

      Divider(),

      // Logout
      ListTile(
        leading: Icon(Icons.logout),
        title: Text('Log Out', style: GoogleFonts.bebasNeue(fontSize: 20, color: Colors.white)),
        onTap: () {
          _logout();
        },
      ),

      // Delete Account
      ListTile(
        leading: Icon(Icons.delete_forever, color: Colors.red),
        title: Text(
          'Delete Account',
          style: GoogleFonts.bebasNeue(fontSize: 20, color: Colors.red),
        ),
        onTap: () {
          _confirmDeleteAccount();
          // Add delete logic
        },
      ),
    ],
  ),
),


      body: Stack(
        children: [
          // Background
          Padding(
            padding: const EdgeInsets.only(top: 10.0),
            child: Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('lib/assets/RedBrushPaintTran.png'),
                  fit: BoxFit.fitHeight,
                ),
              ),
            ),
          ),
          
          SafeArea(
            child: SingleChildScrollView(
              padding: EdgeInsets.symmetric(vertical: 5.0),
              child: Column(
                children: [
                  _buildBlurBox('box1', 'White Belt', '白帯', 'lib/assets/whiteBeltLessonBG.png', 'lib/assets/WhiteBelt.png', WhiteBeltPage(), _getNormalizedProgress(UserSession.progressW)),
                  _buildBlurBox('box2', 'Yellow Belt', '黄色のベルト', 'lib/assets/yellowBeltLessonBG.png', 'lib/assets/YellowBelt.png', YellowBeltPage(), _getNormalizedProgress(UserSession.progressY)),
                  _buildBlurBox('box3', 'Orange Belt', 'オレンジのベルト', 'lib/assets/orangeBeltLessonBG.png', 'lib/assets/OrangeBelt.png', OrangeBeltPage(), _getNormalizedProgress(UserSession.progressO)),
                  _historyBox()
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBlurBox(
  String key,
  String title,
  String subtext,
  String imagePath,
  String beltImagePath,
  Widget destinationPage,
  double progressValue,
) {
  double visibility = visibilityMap[key] ?? 1.0;
  double blurAmount = (1.0 - visibility) * 4;

  return VisibilityDetector(
    key: Key(key),
    onVisibilityChanged: (info) {
      updateVisibility(key, info.visibleFraction);
    },
    child: Center(
      child: Container(
        width: 500,
        height: 700,
        margin: EdgeInsets.all(30),
        child: Material(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          child: InkWell(
            borderRadius: BorderRadius.circular(20),
            splashColor: Colors.yellowAccent.withOpacity(0.4),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => destinationPage),
              );
            },
            child: Ink(
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(20),
                image: DecorationImage(
                  image: AssetImage(imagePath),
                  opacity: 0.5,
                  fit: BoxFit.none,
                  alignment: Alignment.bottomCenter,
                  colorFilter: ColorFilter.mode(
                    Colors.black.withOpacity(0.3),
                    BlendMode.darken,
                  ),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 4,
                    offset: Offset(0, 3),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        SizedBox(height: 8),
                        Text(
                          title,
                          style: GoogleFonts.bebasNeue(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          subtext,
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 18,
                          ),
                        ),
                        SizedBox(height: 150),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: SizedBox(
                            width: 140,
                            height: 15,
                            child: LinearProgressIndicator(
                              value: progressValue,
                              backgroundColor: Colors.white,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                const Color.fromRGBO(168, 184, 189, 1),
                              ),
                            ),
                          ),
                        ),
                        SizedBox(height: 16),
                        Image.asset(
                          beltImagePath,
                          alignment: Alignment.topRight,
                          width: 25,
                          height: 25,
                          fit: BoxFit.contain,
                        ),
                      ],
                    ),
                  ),

                  // Blur effect layer
                  if (blurAmount > 0.1)
                    Positioned.fill(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20),
                        child: BackdropFilter(
                          filter: ImageFilter.blur(
                            sigmaX: blurAmount,
                            sigmaY: blurAmount,
                          ),
                          child: Container(
                            color: Colors.black.withOpacity(0),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

  Widget _historyBox() {
  return VisibilityDetector(
    key: Key('historyBox'),
    onVisibilityChanged: (info) {
      updateVisibility('historyBox', info.visibleFraction);
    },
    child: Center(
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => HistoryPage()),
            );
          },
          splashColor: Colors.yellowAccent.withOpacity(0.3),
          child: Container(
            width: 400,
            height: 700,
            margin: EdgeInsets.all(30),
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage('lib/assets/history.jpeg'),
                opacity: 0.1,
                fit: BoxFit.fitHeight,
                colorFilter: ColorFilter.mode(
                  const Color.fromARGB(255, 223, 213, 213),
                  BlendMode.darken,
                ),
              ),
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 4,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'History',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                Padding(
                  padding: const EdgeInsets.all(10.0),
                  child: Text(
                    '歴史',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 18, color: Colors.grey[700]),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}




}
