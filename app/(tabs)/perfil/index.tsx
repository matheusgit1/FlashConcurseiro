import { useAuth } from '@/src/contexts/AuthContext';
import { colors, shadows, spacing } from '@/src/styles/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PerfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoNome, setNovoNome] = useState(user?.nome || '');
  const [editando, setEditando] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleSalvarNome = () => {
    if (novoNome.trim().length < 3) {
      Alert.alert('Erro', 'O nome deve ter pelo menos 3 caracteres');
      return;
    }
    // Aqui você pode salvar no Firebase/backend
    Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    setEditando(false);
    setModalVisible(false);
  };

  const menuItems = [
    {
      icon: '📈',
      title: 'Meu Progresso',
      description: 'Veja seu desempenho detalhado',
      onPress: () => router.push('/estatisticas'),
    },
    {
      icon: '🎯',
      title: 'Metas',
      description: 'Defina metas de estudo diárias',
      onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento'),
    },
    {
      icon: '🔔',
      title: 'Notificações',
      description: 'Receba lembretes de estudo',
      onPress: () => setNotificacoes(!notificacoes),
      rightElement: (
        <Switch
          value={notificacoes}
          onValueChange={setNotificacoes}
          trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
        />
      ),
    },
    {
      icon: '🌙',
      title: 'Tema Escuro',
      description: 'Alterar tema do aplicativo',
      onPress: () => setTemaEscuro(!temaEscuro),
      rightElement: (
        <Switch
          value={temaEscuro}
          onValueChange={setTemaEscuro}
          trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
        />
      ),
    },
    {
      icon: '💾',
      title: 'Backup',
      description: 'Fazer backup dos seus dados',
      onPress: () => Alert.alert('Backup', 'Backup realizado com sucesso!'),
    },
    {
      icon: '❓',
      title: 'Ajuda',
      description: 'Dúvidas e suporte',
      onPress: () => Alert.alert('Ajuda', 'Entre em contato: suporte@flashconcurseiro.com'),
    },
    {
      icon: '📝',
      title: 'Sobre',
      description: 'Versão 1.0.0',
      onPress: () =>
        Alert.alert(
          'Sobre o FlashConcurseiro',
          'FlashConcurseiro é um app de flashcards para concursos públicos.\n\nVersão: 1.0.0\nDesenvolvido com React Native + Expo'
        ),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header do Perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatar || '👤'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => Alert.alert('Em breve', 'Função de alterar avatar')}
          >
            <Text style={styles.editAvatarText}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.nome}>{user?.nome || 'Usuário'}</Text>
            <TouchableOpacity onPress={() => setEditando(true)}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.email}>{user?.email || 'email@exemplo.com'}</Text>
        </View>

        <TouchableOpacity style={styles.editProfileButton} onPress={() => setEditando(true)}>
          <Text style={styles.editProfileText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Estatísticas Rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Flashcards</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>28</Text>
          <Text style={styles.statLabel}>Dominados</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Dias</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
            </View>
            {item.rightElement ? (
              item.rightElement
            ) : (
              <Text style={styles.menuArrow}>›</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão Sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Versão 1.0.0</Text>

      {/* Modal de Edição de Nome */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editando}
        onRequestClose={() => setEditando(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setEditando(false)}>
          <View style={styles.modalContent}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Editar Perfil</Text>
                <TouchableOpacity onPress={() => setEditando(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalAvatarContainer}>
                  <View style={styles.modalAvatar}>
                    <Text style={styles.modalAvatarText}>{user?.avatar || '👤'}</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    value={novoNome}
                    onChangeText={setNovoNome}
                    placeholder="Digite seu nome"
                    placeholderTextColor={colors.gray[400]}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={user?.email || ''}
                    editable={false}
                    placeholderTextColor={colors.gray[400]}
                  />
                  <Text style={styles.inputHelper}>O email não pode ser alterado</Text>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSalvarNome}>
                  <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    ...shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 44,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: colors.primary[500],
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  editAvatarText: {
    fontSize: 14,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nome: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[800],
  },
  editIcon: {
    fontSize: 16,
    color: colors.primary[500],
  },
  email: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
  editProfileButton: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  editProfileText: {
    color: colors.primary[600],
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    ...shadows.md,
    zIndex: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.gray[200],
  },
  menuContainer: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: 12,
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[800],
  },
  menuDescription: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.gray[400],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red[500],
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.red[200],
    gap: spacing.sm,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.red[600],
  },
  version: {
    textAlign: 'center',
    color: colors.gray[400],
    fontSize: 12,
    marginTop: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
  },
  modalClose: {
    fontSize: 22,
    color: colors.gray[500],
    fontWeight: '300',
  },
  modalBody: {
    padding: spacing.lg,
  },
  modalAvatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatarText: {
    fontSize: 36,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.gray[900],
    backgroundColor: colors.white,
  },
  inputDisabled: {
    backgroundColor: colors.gray[100],
    color: colors.gray[500],
  },
  inputHelper: {
    fontSize: 12,
    color: colors.gray[400],
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});