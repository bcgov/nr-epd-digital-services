import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

export default function SiteRegistryIcon({ siteRegistry }: { siteRegistry: boolean }) {
    if (siteRegistry) {
        return (
            <Eye size='20' className='text-body' data-sr={siteRegistry} />
        )
    }
    else {
        return (
            <EyeSlash size='20' className='text-body' data-sr={siteRegistry} />
        )
    }
}

export function SiteRegistryIconButton({ siteRegistry }: { siteRegistry: boolean }) {
    /**
     * We create a "dummy" state object here.  In final version, would want to replace this with proper state change.
     */
    const [dummySRState, setDummySRState] = useState<boolean>(siteRegistry)
    function onClick() {
        setDummySRState(!dummySRState)
    }

    /**
     * This is to make the 'Make Selected Visible to Public' change work
     * Otherwise, the change to the SiteRegistry prop will not change the value.
     */
    useEffect(() => {
        setDummySRState(siteRegistry);
    }, [siteRegistry])

    return (
        <>
            <Button variant='link' onClick={onClick}>
                <SiteRegistryIcon siteRegistry={dummySRState} /> 
            </Button>
        </>
    )
}