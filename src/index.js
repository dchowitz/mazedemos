import React from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'

import DemoController from './DemoController'
import demoFrontier from './demoFrontier'
import demoGrowth from './demoGrowth'
import demoMaze from './demoMaze'
import demoColorMaze from './demoColorMaze'
import demoRandomDepthFirst from './demoRandomDepthFirst'

const demos = [
  { demoFac: demoFrontier, name: 'frontier' },
  { demoFac: demoGrowth, name: 'growth' },
  { demoFac: demoMaze, name: 'maze' },
  { demoFac: demoColorMaze, name: 'color-maze' },
  { demoFac: demoRandomDepthFirst, name: 'depth-first' }
]

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedDemo: demos[0] }
  }
  render () {
    return (
      <div className="code w-100 vh-100 flex flex-column">
        <div>
          {demos.map(d => (
            <span key={d.name}>
              <a
                className={cn('link underline-hover pointer', this.state.selectedDemo.name === d.name && 'underline')}
                onClick={() => {
                  this.setState({
                    selectedDemo: demos.find(x => x.name === d.name)
                  })
                }}
              >
                {d.name}
              </a>
              &nbsp;
            </span>
          ))}
        </div>
        <div className="flex-auto">
          <DemoController demoFac={this.state.selectedDemo.demoFac} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

if (process.env.NODE_ENV === 'development') {
  module.hot.accept()
}
