import React from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import {
  Home,
  CreditCard,
  BarChart3,
  Target,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react-native";

const TransactionsScreen = () => {
  const transactions = [
    {
      id: 1,
      title: "Proyecto freelance",
      category: "Freelance",
      date: "24 de septiembre del 2025",
      amount: 5500.0,
      type: "income",
    },
    {
      id: 2,
      title: "Cena en restaurante",
      category: "Entretenimiento",
      date: "17 de septiembre del 2025",
      amount: -1200.0,
      type: "expense",
    },
    {
      id: 3,
      title: "Gasolina",
      category: "Transporte",
      date: "10 de septiembre del 2025",
      amount: -350.0,
      type: "expense",
    },
    {
      id: 4,
      title: "Compras del supermercado",
      category: "Alimentación",
      date: "7 de septiembre del 2025",
      amount: -800.0,
      type: "expense",
    },
    {
      id: 5,
      title: "Salario mensual",
      category: "Salario",
      date: "1 de septiembre del 2025",
      amount: 25500.0,
      type: "income",
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8F5F0" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoPlus}>+</Text>
          </View>
          <Text style={styles.logoText}>Ahorra +App</Text>
        </View>
        <View style={styles.profileButton}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileEmoji}>👤</Text>
          </View>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <Text style={styles.titleEmoji}>🔄</Text>
          </View>
          <View>
            <Text style={styles.titleText}>Transacciones</Text>
            <Text style={styles.subtitleText}>5 de 5 transacciones</Text>
          </View>
        </View>
      </View>

      {/* Filters Card */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersCard}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filtros</Text>
            <TouchableOpacity style={styles.filterButton}>
              <SlidersHorizontal size={16} color="#6B7280" />
              <Text style={styles.filterButtonText}>Filtros</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <Text style={styles.searchPlaceholder}>
              Buscar transacciones...
            </Text>
          </View>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      >
        {transactions.map((transaction) => {
          const IconComponent =
            transaction.type === "income" ? TrendingUp : TrendingDown;

          return (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionTitle}>
                    {transaction.title}
                  </Text>

                  <View style={styles.transactionDetails}>
                    <IconComponent
                      size={16}
                      color={
                        transaction.type === "income" ? "#10B981" : "#EF4444"
                      }
                    />
                    <View
                      style={[
                        styles.categoryDot,
                        {
                          backgroundColor:
                            transaction.type === "income"
                              ? "#10B981"
                              : "#EF4444",
                        },
                      ]}
                    />
                    <Text style={styles.categoryText}>
                      {transaction.category}
                    </Text>
                    <Text style={styles.separator}>·</Text>
                    <Text style={styles.dateText}>{transaction.date}</Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.amountText,
                      {
                        color:
                          transaction.type === "income" ? "#10B981" : "#EF4444",
                      },
                    ]}
                  >
                    {transaction.type === "income" ? "+" : "-"} $
                    {Math.abs(transaction.amount).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Edit2 size={20} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Home size={28} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <CreditCard size={28} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <BarChart3 size={28} color="#ffffff" />
          <Text style={styles.activeNavText}>Transacciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Target size={28} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5F0",
  },
  header: {
    backgroundColor: "#E8F5F0",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoPlus: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#10B981",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  profileCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  profileEmoji: {
    fontSize: 14,
  },
  titleSection: {
    backgroundColor: "#E8F5F0",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleEmoji: {
    fontSize: 24,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  subtitleText: {
    fontSize: 14,
    color: "#6B7280",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  filtersCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
  },
  searchBar: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchPlaceholder: {
    color: "#9CA3AF",
    fontSize: 15,
    marginLeft: 8,
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  transactionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  transactionDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 13,
    color: "#6B7280",
  },
  separator: {
    fontSize: 13,
    color: "#9CA3AF",
    marginHorizontal: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 80,
  },
  bottomNav: {
    backgroundColor: "#1F2937",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navButton: {
    alignItems: "center",
    padding: 8,
  },
  activeNavText: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});

export default TransactionsScreen;
