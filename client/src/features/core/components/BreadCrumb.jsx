import { Link as RouterLink } from 'react-router-dom';
import { Link as MaterialLink } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { useMatches } from 'react-router-dom';

function Link({ children, to, ...props }) {
    return (
        <MaterialLink component={RouterLink} to={to} {...props} >
            {children}
        </MaterialLink>
    )
}

export default function BreadCrumb() {
    const matches = useMatches();

    let crumbs = matches
        .filter((match) => match.id.includes("crumb"))
        .map((match) => {
            const crumb = match.id.slice(6)
            return {
                name: crumb,
                path: match.pathname
            }
        })

    return (
        <div role="presentation" style={{ marginBottom: 20 }}>
            <Breadcrumbs aria-label="breadcrumb">
                {crumbs.map((crumb, index) => {
                    return (
                        <Link to={crumb.path} key={index}>
                                {crumb.name}
                        </Link>
                    )
                })}
            </Breadcrumbs>
        </div>
    )
}