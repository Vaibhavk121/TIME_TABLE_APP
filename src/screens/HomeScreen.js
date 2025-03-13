import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Switch, Card, FAB } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { timetableData } from "../data/timetableData";
import { timetable2Data } from "../data/timetable2Data";
import moment from "moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const HomeScreen = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentWeekDates, setCurrentWeekDates] = useState([]);
  const [isClass6A, setIsClass6A] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWeekDates();
  }, []);

  useEffect(() => {
    setSelectedDay(null);
  }, [isClass6A]);

  const loadWeekDates = () => {
    const startOfWeek = moment().startOf('isoWeek');
    const dates = [];
    for (let i = 0; i < 6; i++) {
      dates.push({
        date: startOfWeek.clone().add(i, 'days').format("DD MMM"),
        dayName: startOfWeek.clone().add(i, 'days').format("ddd")
      });
    }
    setCurrentWeekDates(dates);
  };

  const currentData = isClass6A ? (timetable2Data || []) : (timetableData || []);

  

  const getCurrentDay = () => moment().format("ddd");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Class Timetable</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.classLabel}>6-B</Text>
          <Switch
            value={isClass6A}
            onValueChange={setIsClass6A}
            color="#6366f1"
            thumbColor="#fff"
            trackColor={{ false: "#cbd5e1", true: "#a5b4fc" }}
          />
          <Text style={styles.classLabel}>6-A</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.dayContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                loadWeekDates();
                setRefreshing(false);
              }, 1000);
            }}
            colors={['#6366f1']}
          />
        }
      >
        {currentData?.map((dayData) => {
          if (!dayData.periods || dayData.periods.length === 0) return null;
          return (
            <Card
              key={dayData.day}
              containerStyle={[
                styles.dayCard,
                selectedDay === dayData.day && styles.selectedCard
              ]}
            >
              <Card.Title 
                style={styles.cardTitle}
                onPress={() => setSelectedDay(selectedDay === dayData.day ? null : dayData.day)}
              >
                <View style={styles.cardHeader}>
                  <Icon 
                    name="calendar" 
                    size={20} 
                    color="#4f46e5" 
                    style={styles.icon} 
                  />
                  <Text style={styles.cardTitleText}>{dayData.day}</Text>
                </View>
              </Card.Title>
              
              {selectedDay === dayData.day && (
                <>
                  <Card.Divider style={styles.divider} />
                  {dayData.periods?.map((period, index) => (
                    <View key={index} style={styles.periodItem}>
                      <View style={styles.timeBadge}>
                        <Text style={styles.timeText}>{period.time}</Text>
                      </View>
                      <Text style={styles.subjectText}>{period.subject}</Text>
                    </View>
                  ))}
                </>
              )}
            </Card>
          );
        })}
      </ScrollView>

      <FAB
        visible={!!selectedDay}
        placement="right"
        icon={{ name: "close", color: "white" }}
        color="#ef4444"
        onPress={() => setSelectedDay(null)}
      />

      <Text style={styles.weekText}>
        {isClass6A ? "6-A" : "6-B"} • Week of {currentWeekDates[0]?.date} - {currentWeekDates[5]?.date}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  classLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
  },
  dayContainer: {
    padding: 16,
    paddingTop: 8,
  },
  dayCard: {
    borderRadius: 16,
    borderWidth: 0,
    padding: 0,
    marginBottom: 16,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#818cf8",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "left",
    width: "100%",
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  icon: {
    marginRight: 12,
  },
  divider: {
    backgroundColor: "#e2e8f0",
    marginVertical: 0,
  },
  periodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f1f5f9",
    margin: 8,
    borderRadius: 12,
  },
  timeBadge: {
    backgroundColor: "#c7d2fe",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  timeText: {
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: 14,
  },
  subjectText: {
    fontSize: 16,
    color: "#334155",
    flexShrink: 1,
  },
  weekText: {
    textAlign: "center",
    color: "#64748b",
    padding: 16,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default HomeScreen;
