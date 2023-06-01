package ca.bc.gov.epd.kafka.connect.transform;

import java.util.Map;

import org.apache.kafka.common.config.ConfigDef;
import org.apache.kafka.connect.connector.ConnectRecord;
import org.apache.kafka.connect.transforms.Transformation;

public class ToUpperCase<R extends ConnectRecord<R>> implements Transformation<R> {

	@Override
	public void configure(Map<String, ?> configs) {
		
	}

	@Override
	public R apply(R record) {
		final String newTopic = record.topic().toUpperCase();
		return record.newRecord(
		        newTopic,
		        record.kafkaPartition(),
		        record.keySchema(),
		        record.key(),
		        record.valueSchema(),
		        record.value(),
		        record.timestamp()
		    );
	}

	@Override
	public ConfigDef config() {
		return new ConfigDef();
	}

	@Override
	public void close() {
		
	}

}
