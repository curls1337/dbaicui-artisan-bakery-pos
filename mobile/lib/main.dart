import 'package:flutter/material.dart';
import 'models/bakery_state.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/catalog_screen.dart';
import 'screens/oven_screen.dart';
import 'screens/profile_screen.dart';

void main() {
  runApp(const DBaiCuiMobileApp());
}

class DBaiCuiMobileApp extends StatefulWidget {
  const DBaiCuiMobileApp({super.key});

  @override
  State<DBaiCuiMobileApp> createState() => _DBaiCuiMobileAppState();
}

class _DBaiCuiMobileAppState extends State<DBaiCuiMobileApp> {
  final BakeryAppState _state = BakeryAppState();

  @override
  void initState() {
    super.initState();
    _state.addListener(() {
      if (mounted) setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "D'Bai Cui Artisan Bakery",
      debugShowCheckedModeBanner: false,
      themeMode: _state.isDarkTheme ? ThemeMode.dark : ThemeMode.light,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD97706),
          brightness: Brightness.light,
          primary: const Color(0xFFD97706),
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD97706),
          brightness: Brightness.dark,
          primary: const Color(0xFFD97706),
        ),
      ),
      home: _state.isAuthenticated
          ? MainNavigationShell(state: _state)
          : LoginScreen(
              state: _state,
              onLoginSuccess: () => setState(() {}),
            ),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  final BakeryAppState state;

  const MainNavigationShell({super.key, required this.state});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  void _onTabChanged(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = widget.state.isDarkTheme;
    final navBg = isDark ? const Color(0xFF1E293B) : Colors.white;

    final screens = [
      HomeScreen(state: widget.state, onNavigateTab: _onTabChanged),
      CatalogScreen(state: widget.state),
      OvenScreen(state: widget.state),
      ProfileScreen(
        state: widget.state,
        onLogout: () {
          widget.state.logout();
        },
      ),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: navBg,
          border: Border(
            top: BorderSide(
              color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0),
            ),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 10,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onTabChanged,
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFFD97706),
          unselectedItemColor: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 11),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_rounded),
              label: 'Beranda',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.cake_rounded),
              label: 'Katalog',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.microwave_rounded),
              label: 'Oven KDS',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.tune_rounded),
              label: 'Profil & API',
            ),
          ],
        ),
      ),
    );
  }
}
