import React, { useEffect } from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from '@mui/material/styles';
import CoursePlannerCards from './CoursePlannerCards';

interface CourseAccordionProps {
  title: any;
  type: string;
  resources: any; 
  expanded: boolean;
  onChange?: (event: React.SyntheticEvent, expanded: boolean) => void;
}

const CourseAccordion: React.FC<CourseAccordionProps> = ({ title, type, resources, expanded, onChange }) => {
  const theme = useTheme<any>();

  useEffect(() => {
    console.log("resources", type, resources);
  }, []);

  return (
    <Box sx={{ mt: 2, mb: 1.5 }}>
      <Accordion expanded={expanded} onChange={onChange}
        sx={{
          boxShadow: 'none !important',
          border: 'none !important',
          mt: 1.5,
          background: theme?.palette?.action?.selected,
          '&.MuiAccordion-root': {
            marginTop: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ArrowDropDownIcon sx={{ color: theme?.palette?.warning['300'] }} />
          }
          aria-controls="panel-content"
          id="panel-header"
          className="accordion-summary"
          sx={{
            m: 0,
            background: theme?.palette?.action?.selected,
            px: '16px',
            height: '10px !important',
            '&.Mui-expanded': {
              minHeight: '48px',
            },
          }}
        >
          <Typography
            fontWeight="500"
            fontSize="14px"
            sx={{ color: theme?.palette?.warning['300'] }}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: '0px',
            background: theme?.palette?.warning['A400'],
          }}
        >
          <CoursePlannerCards resources={resources} type={type} />

          {
            resources?.length === 0 && <Typography sx={{ p: '10px', mt:2, fontSize: '12px'}}>No resources found</Typography>
          }
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CourseAccordion;