import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

class WhiteBeltPage extends StatefulWidget {
  final String? kataName;

  const WhiteBeltPage({super.key, this.kataName});

  @override
  State<WhiteBeltPage> createState() => _WhiteBeltPageState();
}

class _WhiteBeltPageState extends State<WhiteBeltPage> {
  late YoutubePlayerController _controller;
  int _currentLessonIndex = 0;
  final List<bool> _completedLessons = List.generate(8, (index) => false);

  final List<Map<String, String>> lessons = [
    {
      'title': 'Lesson 1: Basic Blocking',
      'url': 'https://youtu.be/FJPltl4Moag?si=S5wjLZEvLuYJqyFU',
    },
    {
      'title': 'Lesson 2: Basic Punching',
      'url': 'https://youtu.be/2xN9JKTOWQQ?si=Nda3IQjvqcxpkE9-',
    },
    {
      'title': 'Lesson 3: Basic Kicking',
      'url': 'https://youtu.be/8sKklkweXdU?si=64DwTzTUbaqVAijO',
    },
    {
      'title': 'Lesson 6: Go Ho No Uke',
      'url': 'https://youtu.be/8vfnP-52X5A?si=oDa7DED0UpNso8fx',
    },
    {
      'title': 'Lesson 7: Empi Roppo',
      'url': 'https://youtu.be/W5DE-2QsgpI?si=mVqDPuuXjmKmXY7-',
    },
    {
      'title': 'Lesson 8: Ten No Kata',
      'url': 'https://youtu.be/fxx9OWrROr8?si=wcpQSFOtJfRoN8co',
    },
  ];

  void _initializePlayer(String url) {
    _controller = YoutubePlayerController(
      initialVideoId: YoutubePlayer.convertUrlToId(url) ?? '',
      flags: const YoutubePlayerFlags(
        autoPlay: true,
        mute: false,
      ),
    )..addListener(_videoListener);
  }

  void _videoListener() {
    if (_controller.value.position.inSeconds >=
            _controller.metadata.duration.inSeconds - 5 &&
        !_completedLessons[_currentLessonIndex]) {
      // Mark as complete near end
      setState(() {
        _completedLessons[_currentLessonIndex] = true;
        if (_currentLessonIndex + 1 < lessons.length) {
          _currentLessonIndex++;
          _controller.removeListener(_videoListener);
          _initializePlayer(lessons[_currentLessonIndex]['url']!);
        }
      });
    }
  }

  @override
void initState() {
  super.initState();

  if (widget.kataName != null) {
    final index = lessons.indexWhere((lesson) =>
        lesson['title']!.toLowerCase().contains(widget.kataName!.toLowerCase()));
    _currentLessonIndex = index != -1 ? index : 0;
  }

  _initializePlayer(lessons[_currentLessonIndex]['url']!);
}


  @override
  void dispose() {
    _controller.removeListener(_videoListener);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return YoutubePlayerBuilder(
      player: YoutubePlayer(controller: _controller),
      builder: (context, player) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('White Belt Curriculum'),
          ),
          body: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: [
                player,
                const SizedBox(height: 16),
                const Text(
                  'Lessons',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Expanded(
                  child: ListView.builder(
                    itemCount: lessons.length,
                    itemBuilder: (context, index) {
                      bool isUnlocked = index == 0 || _completedLessons[index - 1];
                      bool isCompleted = _completedLessons[index];

                      return ListTile(
                        enabled: isUnlocked,
                        leading: Icon(
                          isCompleted
                              ? Icons.check_circle
                              : isUnlocked
                                  ? Icons.radio_button_unchecked
                                  : Icons.lock,
                          color: isCompleted
                              ? Colors.green
                              : isUnlocked
                                  ? Colors.grey
                                  : Colors.red,
                        ),
                        title: Text(
                          lessons[index]['title']!,
                          style: TextStyle(
                            color: isUnlocked ? Colors.black : Colors.grey,
                          ),
                        ),
                        onTap: isUnlocked
                            ? () {
                                setState(() {
                                  _currentLessonIndex = index;
                                  _controller.removeListener(_videoListener);
                                  _initializePlayer(lessons[index]['url']!);
                                });
                              }
                            : null,
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
