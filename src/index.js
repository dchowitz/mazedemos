import React from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'

import DemoController from './DemoController'
import demoFrontier from './demoFrontier'
import demoGrowth from './demoGrowth'
import demoMaze from './demoMaze'
import demoColorMaze from './demoColorMaze'
import demoRandomDepthFirst from './demoRandomDepthFirst'
import demoMask from './demoMask'

const demos = [
  { demoFac: demoFrontier, name: 'frontier' },
  { demoFac: demoGrowth, name: 'growth' },
  { demoFac: demoMaze, name: 'maze' },
  { demoFac: demoColorMaze, name: 'color-maze' },
  { demoFac: demoRandomDepthFirst, name: 'depth-first' },
  { demoFac: demoMask, name: 'mask' }
]

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { selectedDemo: demos[0] }
  }
  render () {
    return (
      <div>
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
          <div id="logo" className="flex-auto sans-serif relative">
            <h1 className="ma0 pa0 overflow-hidden">
              <span id="logo-1">Amazing</span>
              <br />
              <span id="logo-2" className="db relative green">
                X-mas
              </span>
            </h1>
            <div className="absolute top-0 bottom-0 left-0 right-0" style={{ zIndex: 100 }}>
              <DemoController demoFac={this.state.selectedDemo.demoFac} />
            </div>
          </div>
        </div>
        <style jsx>{`
          #logo {
            color: red;
            font-weight: bold;
          }
          #logo-1 {
            font-size: 9em;
            letter-spacing: -0.15em;
          }
          #logo-2 {
            font-size: 9em;
            letter-spacing: -0.15em;
            top: -0.5em;
          }
        `}</style>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

if (process.env.NODE_ENV === 'development') {
  module.hot.accept()
}
