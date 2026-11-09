import 'package:flutter/material.dart';
import '../models/bakery_state.dart';

class ProfileScreen extends StatefulWidget {
  final BakeryAppState state;
  final VoidCallback onLogout;

  const ProfileScreen({
    super.key,
    required this.state,
    required this.onLogout,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late TextEditingController _urlController;

  @override
  void initState() {
    super.initState();
    _urlController = TextEditingController(text: widget.state.serverUrl);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = widget.state.isDarkTheme;
    final bgCol = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final cardCol = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textCol = isDark ? Colors.white : const Color(0xFF0F172A);
    final role = widget.state.activeRole;

    return Scaffold(
      backgroundColor: bgCol,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                "Profil & Pengaturan Sistem",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textCol),
              ),
              const SizedBox(height: 16),

              // Profile Header Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: cardCol,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0),
                  ),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 30,
                      backgroundColor: const Color(0xFFD97706),
                      child: Text(
                        role.userName.substring(0, 1),
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            role.userName,
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: textCol),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            role.email,
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFFD97706).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text(
                              role.label,
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFD97706)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Quick Switch Role Panel
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: cardCol,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Quick Switch Role (Demo RBAC)",
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: textCol),
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: UserRole.values.map((r) {
                        final active = widget.state.activeRole == r;
                        return ChoiceChip(
                          label: Text(r.label.split(' ')[0]),
                          selected: active,
                          selectedColor: const Color(0xFFD97706),
                          labelStyle: TextStyle(
                            color: active ? Colors.white : textCol,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                          onSelected: (_) => widget.state.switchRole(r),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // API Server Endpoint Configuration
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: cardCol,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Konfigurasi Server REST API",
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: textCol),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _urlController,
                      style: TextStyle(color: textCol, fontSize: 13),
                      decoration: InputDecoration(
                        labelText: "Backend Base URL",
                        prefixIcon: const Icon(Icons.dns_rounded, color: Color(0xFFD97706), size: 20),
                        filled: true,
                        fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: () {
                          widget.state.updateServerUrl(_urlController.text);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text("Endpoint disimpan: ${_urlController.text}")),
                          );
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFFD97706),
                          side: const BorderSide(color: Color(0xFFD97706)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text("Simpan Endpoint API", style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Theme Toggle & Version Info
              Container(
                decoration: BoxDecoration(
                  color: cardCol,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: isDark ? Colors.white.withOpacity(0.08) : const Color(0xFFE2E8F0),
                  ),
                ),
                child: Column(
                  children: [
                    SwitchListTile(
                      title: Text("Tema OLED Luxury Dark", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: textCol)),
                      subtitle: Text(
                        isDark ? "Aktif (Hemat baterai layar OLED)" : "Mode Light Alabaster",
                        style: TextStyle(fontSize: 11, color: isDark ? Colors.white54 : Colors.black54),
                      ),
                      value: isDark,
                      activeColor: const Color(0xFFD97706),
                      onChanged: (_) => widget.state.toggleTheme(),
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.verified_rounded, color: Color(0xFF10B981)),
                      title: Text("Versi Aplikasi Mobile", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: textCol)),
                      trailing: Text(
                        "v1.0.0 (CI Ready)",
                        style: TextStyle(fontSize: 12, color: isDark ? Colors.white60 : Colors.black54),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              SizedBox(
                height: 48,
                child: ElevatedButton.icon(
                  onPressed: widget.onLogout,
                  icon: const Icon(Icons.logout_rounded),
                  label: const Text("Keluar (Logout)", style: TextStyle(fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFEF4444).withOpacity(0.15),
                    foregroundColor: const Color(0xFFEF4444),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
