import Popup from "./Popup.jsx";

export default function PopupContainer({ popups }) {
    console.log('🔥 Current popups:', popups);

    return (
        <div className="popup-container">
            {popups.map((p) => (
                <Popup key={p.id} {...p} />
            ))}
        </div>
    );
}