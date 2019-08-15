import * as React from 'react'
import { Text, View, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native'
import moment from 'moment'

const { width } = Dimensions.get('window')

export default class App extends React.Component {
  constructor(props) { 
    super(props)
    this.state = {
      dates: [],
      currentDate: moment().format('YYYY-MM-DD'),
      currentIndex: 0
    }
  } 

  componentDidMount() {
    this.setNewDates()

    const to = 4
    setTimeout(() => {
      this.scroll.scrollTo({x: to * 75, animated: true })
    }, 0)    
  }

  setNewDates = (date, toDate) => {
    const currentDate = date ? date : this.state.currentDate
    console.log('current date', moment(currentDate).format('YYYY-MM-DD'))
    var startOfWeek = moment(currentDate).subtract('1', 'month').startOf('month')
    var endOfWeek = moment(currentDate).add('1', 'month').endOf('month')

    var days = []
    var day = startOfWeek

    while (day <= endOfWeek) {
      days.push(day.toDate())
      day = day.clone().add(1, 'd')
    }

    

    this.setState({ dates: days }, () => {
      index = days.findIndex(d => moment(d).format('YYYY-MM-DD') ===  moment(toDate).format('YYYY-MM-DD'))
      if (date) {
        this.scroll.scrollTo({x: index * 75, animated: false })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 80 }}>
          <ScrollView
            ref={(ref) => { this.scroll = ref }}
            horizontal
            snapToInterval={75}
            decelerationRate={"fast"}
            scrollEventThrottle={16}
            snapToAlignment={'center'}
            onMomentumScrollEnd={this.onMomentumScrollEnd}
            onScroll={Animated.event([{nativeEvent: {
                contentOffset: {
                  x: this.scrollValue
                }
              }
            }])}
            style={{ overflow: 'visible', paddingLeft: width / 2 - 75 / 2 }}
            contentContainerStyle={{  }}
          >
            {
              this.state.dates.map((item, index) => this.renderDate(item, index))
            }
          </ScrollView>
        </View>
      </View>
    );
  }

  onMomentumScrollEnd = (e) => {
    const { dates } = this.state
    const { nativeEvent: { contentOffset: { x } } } = e
    const currentIndex = Math.round(x / 75)
    console.log(currentIndex, dates.length)

    if (dates.length - 15 <= currentIndex) {
      this.setNewDates(dates[dates.length - 1], dates[currentIndex])
    }
    
    if (currentIndex <= 10) {
      this.setNewDates(dates[0], dates[currentIndex])
    }
  }

  scrollValue = new Animated.Value(0)
  scroll

  renderDate = (item, index) => {

    const scale = this.scrollValue.interpolate({
      inputRange: [(index - 1) * 75, (index) * 75, (index + 1) * 75],
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp'
    })

    return (
      <View key={index} style={{ width: 70, height: 70, alignItems: 'center', marginRight: 5, justifyContent: 'flex-end' }}>
        <Animated.View style={{ backgroundColor: '#333', width: 70, height: 70, alignItems: 'center', justifyContent: 'center', borderRadius: 12, transform: [{ scale }] }}>
          <Text style={{ color: '#fff' }}>{moment(item).format('DD')}</Text>
          <Text style={{ color: '#fff' }}>{moment(item).format('MMMM')}</Text>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
