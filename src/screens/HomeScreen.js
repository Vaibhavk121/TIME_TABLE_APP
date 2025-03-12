import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { timetableData } from "../data/timetableData";
import moment from "moment";

const HomeScreen = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentWeekDates, setCurrentWeekDates] = useState([]);

  useEffect(() => {
    const startOfWeek = moment().startOf('isoWeek');
    const dates = [];
    for (let i = 0; i < 6; i++) {
      dates.push({
        date: startOfWeek.clone().add(i, 'days').format("DD MMM"),
        dayName: startOfWeek.clone().add(i, 'days').format("ddd")
      });
    }
    setCurrentWeekDates(dates);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Timetable</Text>

      <View style={styles.buttonContainer}>
        {timetableData.map(({ day }) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.activeButton]}
            onPress={() => setSelectedDay(selectedDay === day ? null : day)}
          >
            <Text style={[styles.dayText, selectedDay === day && styles.activeText]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedDay && (
        <ScrollView style={styles.timetableContainer}>
          <Text style={styles.dayHeader}>{selectedDay}</Text>
          {timetableData
            .find(dayData => dayData.day === selectedDay)
            ?.periods.map((period, index) => (
              <View key={index} style={styles.period}>
                <Text style={styles.time}>{period.time}</Text>
                <Text style={styles.subject}>{period.subject}</Text>
              </View>
            ))}
        </ScrollView>
      )}

      <Text style={styles.weekText}>
        Week of {currentWeekDates[0]?.date} - {currentWeekDates[5]?.date}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F2F2F2" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  buttonContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  dayButton: { backgroundColor: "#3498DB", padding: 10, margin: 5, borderRadius: 5, minWidth: 80, alignItems: "center" },
  activeButton: { backgroundColor: "#2980B9" },
  dayText: { color: "white", fontSize: 16, fontWeight: "bold" },
  activeText: { color: "#FFD700" },
  timetableContainer: { marginTop: 20, padding: 15, backgroundColor: "#FFFFFF", borderRadius: 5 },
  dayHeader: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  period: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  time: { fontSize: 16, fontWeight: "bold", color: "#333" },
  subject: { fontSize: 16, color: "#555" },
  weekText: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginTop: 10 },
});

export default HomeScreen;
