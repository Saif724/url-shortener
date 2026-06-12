import QRCode from "react-qr-code";

export default function QRModal({show, onClose, value}) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-[#111827] border border-white/10 p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-4">
                    QR Code
                </h2>

                <div className="bg-white p-4 rounded-xl inline-block">
                    <QRCode value={value} size={180}/>
                </div>

                <p className="text-gray-400 text-sm mt-4 break-all">
                    {value}
                </p>

                <button
                    onClick={onClose}
                    className="mt-5 px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
                >
                    Close
                </button>
            </div>
        </div>
    )
}