import re

# Define the input and output file paths
input_file_path = 'output_sis_dml.sql'
output_file_path = 'output_dump.sql'

def convert_st_geometry_to_value(sql_statement):
    # Replace ST_Geometry('value', ) with 'value'
    modified_sql = sql_statement.replace("ST_Geometry('", "'").replace("', )", "'")

    # Replace ST_GeomFromText('POINT with ST_SetSRID(ST_MakePoint
    modified_sql = modified_sql.replace("ST_GeomFromText('POINT", "ST_SetSRID(ST_MakePoint").rstrip(';')

    # Add a comma between the two coordinates
    #modified_sql = modified_sql.replace(")', ", "), ")
    modified_sql = modified_sql.replace(")', ", "), ")

    # Regular expression pattern to match the first number in the ST_MakePoint function call
    pattern = r"(ST_MakePoint\s*\(\s*\d+\.\d+)\s+(\d+\.\d+)"

    # Replacement string with a comma and a space after the first number
    replacement = r"\1 ,  \2"

    # Using re.sub to replace the matched pattern with the replacement string
    modified_sql = re.sub(pattern, replacement, modified_sql)

    return modified_sql


# Open the input and output files
with open(input_file_path, 'r') as input_file, open(output_file_path, 'w') as output_file:
    # Read the input file line by line
    for line in input_file:
        # Check if the line contains an INSERT statement
        if line.startswith('INSERT INTO'):
            # Call the function to convert ST_Geometry() to value
            output_sql = convert_st_geometry_to_value(line)
            output_file.write(output_sql)
        else:
            # Write non-INSERT lines to the output file as is
            output_file.write(line)

# Print a message indicating the process is complete
print("Insert statements modified and written to:", output_file_path)
