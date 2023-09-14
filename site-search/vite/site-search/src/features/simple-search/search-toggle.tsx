
import ToggleButton from 'react-bootstrap/ToggleButton';

export default function SearchToggle({ checked, onChange, children }) {

    return (
        <ToggleButton
            className="mb-2"
            type="checkbox"
            variant="outline-primary"
            id={convertToClassName(children)}
            checked={checked}
            value="1"
            onChange={(e) => onChange(e.currentTarget.checked)}
        >
            {children}
        </ToggleButton>
    )
}

function convertToClassName(str: string): string {
    return str.replace(' ', '-').toLowerCase()
}