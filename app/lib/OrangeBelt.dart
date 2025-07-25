import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

class OrangeBeltPage extends StatefulWidget {
  final String? kataName;

  const OrangeBeltPage({super.key, this.kataName});

  @override
  State<OrangeBeltPage> createState() => _OrangeBeltPageState();
}

class _OrangeBeltPageState extends State<OrangeBeltPage> {
  late YoutubePlayerController _controller;
  int _currentLessonIndex = 0;
  final List<bool> _completedLessons = List.generate(8, (index) => false);

  final List<Map<String, String>> lessons = [
    {
      'title': 'Lesson 1: Tenchi Happo 7-8 Traditional',
      'url': 'https://youtu.be/fTqnJaLS_RY?si=v5_OwAPvI-EwEmAd&t=399',
    },
    {
      'title': 'Lesson 2: Cat Stance',
      'url': 'https://youtu.be/kHIUkFahyKA?si=WR9cxKXQsp0oeb9j',
    },
    {
      'title': 'Lesson 3: Pinan Shodan',
      'url': 'https://youtu.be/qNP1pbzXXJs?si=O1hv_WwY4A_d3i57',
    },
    {
      'title': 'Lesson 4: Roppo Ho',
      'url': 'https://youtu.be/MiYJWNg6DSs?si=fxCYoFd_Gv-56D4F',
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
            title: const Text('Orange Belt Curriculum'),
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
