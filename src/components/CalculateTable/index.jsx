import { useState, useEffect } from 'react';
import './index.scss';
import {useEditCalculationMutation} from "../../services/adminApi.jsx";

const CalculationTable = ({ type, selectedDate, data = [],companyId }) => {
    const isCurrent = type === 'current';
    const firstItem = data;
    const [isEditing, setIsEditing] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [initialAmount, setInitialAmount] = useState(firstItem?.initialAmount);
    const [editCalc] = useEditCalculationMutation();
    console.log(firstItem)
    useEffect(() => {
        if (firstItem?.initialAmount !== undefined) {
            setInitialAmount(firstItem.initialAmount);
        }
    }, [firstItem]);

    const handleSave = async () => {
        setIsEditing(false);
        if (!firstItem?.companyId) return;

        try {
            await editCalc({
                companyId: companyId,
                newAmount: initialAmount,
            }).unwrap();
            // burda toast və ya alert göstərə bilərsən
        } catch (err) {
            console.error("Məbləğ dəyişdirilə bilmədi", err);
            alert("Xəta baş verdi");
        }
    };

    const title = selectedDate
        ? `${selectedDate.monthName}`
        : isCurrent
            ? 'Cari ay'
            : 'Əvvəlki ay';

    return (
        <div className="calc-table-container">
            <div className="header">
                <span>{title}</span>
            </div>
            <table className="calc-table">
                <tbody>
                <tr
                    className={isCurrent ? 'editable-row' : ''}
                    onMouseEnter={() => isCurrent && setHovered(true)}
                    onMouseLeave={() => isCurrent && setHovered(false)}
                >
                    <td>Ayın ilkin məbləği</td>
                    <td
                        className="edit-target"
                        onClick={() => isCurrent && setIsEditing(true)}
                    >
                        <div className="edit-wrapper">
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={initialAmount === 0 ? '' : initialAmount}
                                    onChange={(e) => setInitialAmount(Number(e.target.value))}
                                    onBlur={handleSave}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <span>{initialAmount || "0"}</span>
                                    {isCurrent && (
                                        <span className={`edit-icon ${hovered ? 'visible' : ''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
  <path d="M12.5 3.27501C12.5005 3.19276 12.4847 3.11122 12.4536 3.03507C12.4225 2.95892 12.3767 2.88966 12.3188 2.83126L9.66876 0.18126C9.61036 0.123335 9.5411 0.0775063 9.46495 0.0464034C9.3888 0.0153005 9.30727 -0.000465112 9.22501 1.04464e-05C9.14276 -0.000465112 9.06122 0.0153005 8.98507 0.0464034C8.90892 0.0775063 8.83966 0.123335 8.78126 0.18126L7.01251 1.95001L0.18126 8.78126C0.123335 8.83966 0.0775063 8.90892 0.0464034 8.98507C0.0153005 9.06122 -0.000465112 9.14276 1.04464e-05 9.22501V11.875C1.04464e-05 12.0408 0.0658585 12.1997 0.183069 12.317C0.300279 12.4342 0.45925 12.5 0.62501 12.5H3.27501C3.36247 12.5048 3.44994 12.4911 3.53177 12.4599C3.6136 12.4286 3.68796 12.3806 3.75001 12.3188L10.5438 5.48751L12.3188 3.75001C12.3757 3.68936 12.4222 3.61966 12.4563 3.54376C12.4623 3.49394 12.4623 3.44358 12.4563 3.39376C12.4592 3.36467 12.4592 3.33535 12.4563 3.30626L12.5 3.27501ZM3.01876 11.25H1.25001V9.48126L7.45626 3.27501L9.22501 5.04376L3.01876 11.25ZM10.1063 4.16251L8.33751 2.39376L9.22501 1.51251L10.9875 3.27501L10.1063 4.16251Z" fill="#323232"/>
</svg>
                                            </span>
                                    )}
                                </>
                            )}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td>Verilən sifariş məbləği</td>
                    <td>{firstItem?.orderTotalAmount || "0"}</td>
                </tr>
                <tr>
                    <td>Ümumi məbləğ</td>
                    <td>{initialAmount + (firstItem?.orderTotalAmount) || "0"}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CalculationTable;
