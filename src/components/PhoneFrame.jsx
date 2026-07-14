import './PhoneFrame.css'

/**
 * A device shell used to preview the app on desktop. On a real phone-sized
 * viewport the frame collapses and the screen fills the display edge to edge.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="frame-stage">
      <div className="phone">
        <div className="phone__island" aria-hidden="true">
          <span className="phone__camera" />
        </div>
        <div className="phone__screen">{children}</div>
      </div>
    </div>
  )
}
